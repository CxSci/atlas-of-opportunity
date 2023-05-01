import psycopg2 as pg
import requests
from django.conf import settings
from psycopg2 import sql
from rest_framework import permissions, views, viewsets
from rest_framework.decorators import api_view
from rest_framework.exceptions import NotFound
from rest_framework.response import Response
from rest_framework.reverse import reverse

from api.models import Dataset
from api.serializers import DatasetSerializer
from api.simulated_poi_accessibility import normalized_poi_accessibility_score


def execute_sql(conn, query, params=None, many=True):
    with conn.cursor(cursor_factory=pg.extras.RealDictCursor) as cur:
        cur.execute(query, params)
        if many:
            return cur.fetchall()
        else:
            return cur.fetchone()
    return None


def sql_comma_join(sql_composable):
    return sql.SQL(", ").join(sql_composable)


def escaped_sql_literal(s):
    # Necessary to support generating VALUES tuples like `('Top 1%')`.
    #
    # https://www.psycopg.org/docs/usage.html#passing-parameters-to-sql-queries
    # "When parameters are used, in order to include a literal % in the query
    # you can use the %% string"
    if isinstance(s, str):
        s = s.replace("%", "%%")
    return sql.Literal(s)


def build_melted_select_statement(
    table_name,
    var_names,
    value_vars,
    primary_key,
    id_vars=None,
    join_vars=None,
    value_name="value",
    schema_name="public",
    **kwargs,
):
    """Returns a composed query for melting/unpivoting wide tables.

    Can turn tables like:

    | id | foo | bar | baz |
    |  0 |   a |   A |   i |
    |  1 |   b |   B |  ii |

    Into tables like:

    | id | type | value |
    |  0 |  foo |     a |
    |  1 |  foo |     b |
    |  0 |  bar |     A |
    |  1 |  bar |     B |
    |  0 |  baz |     i |
    |  1 |  baz |    ii |

    Produces SQL queries like:

    select type, value
    from sa2_info_for_dashboard
        cross join lateral (
            values
            ('foo', 'All', persons_num),
            ('bar', 'Male', males_num),
            ('baz', 'Female', females_num)
        ) v(column_name, type, value)
    where sa2_code='401011001'
    """
    select_columns = []
    if id_vars:
        select_columns += [sql.Identifier(table_name, c) for c in id_vars]
    # TODO: add support for multiple joins and multiple columns to join each on
    if join_vars:
        select_columns += [
            sql.Identifier(join_vars["target_join_table"], c)
            for c in join_vars["target_select_columns"]
        ]
    select_columns += [sql.Identifier("v", c) for c in var_names + [value_name]]
    select_columns = sql_comma_join(select_columns)
    values = []
    for i, value_var in enumerate(value_vars):
        literals = [i, value_var["column"]] + value_var["replacements"]
        values += sql.Composed(
            [
                sql.SQL("({value_var})").format(
                    value_var=sql_comma_join(
                        [sql.Identifier(value_var["column"])]
                        + [escaped_sql_literal(s) for s in literals]
                    )
                )
            ]
        )

    query = sql.SQL("SELECT {select} FROM {schema}.{table}").format(
        select=select_columns,
        schema=sql.Identifier(schema_name),
        table=sql.Identifier(table_name),
    )
    if join_vars:
        query += sql.SQL(
            "LEFT OUTER JOIN {join_table} "
            "ON {source_join_column}={target_join_column} "
        ).format(
            join_table=sql.Identifier(join_vars["target_join_table"]),
            source_join_column=sql.Identifier(
                table_name, join_vars["source_join_column"]
            ),
            target_join_column=sql.Identifier(
                join_vars["target_join_table"], join_vars["target_join_column"]
            ),
        )
    query += sql.SQL(
        "CROSS JOIN LATERAL (VALUES {values}) v({columns}) "
        "WHERE {primary_key}=%(pk)s ORDER BY i"
    ).format(
        values=sql_comma_join(values),
        columns=sql_comma_join(
            [
                sql.Identifier(c)
                for c in [value_name, "i", "variable"] + var_names
            ]
        ),
        primary_key=sql.Identifier(primary_key),
    )
    return query


class DatasetViewSet(viewsets.ModelViewSet):
    queryset = Dataset.objects.all()
    serializer_class = DatasetSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


@api_view()
def search_dataset(request, dataset=None):
    # `query` can't be longer than 256 characters or more than 20 tokens
    # This doesn't help with non-Latin character sets as Mapbox tokenizes
    # each CJK character separately, e.g. "菜食主義者" counts as 5 tokens.
    query = request.query_params.get("q", "")
    query = " ".join(query[:256].split()[:20])

    if len(query) < 1:
        return Response({"error": "Need at least 1 search term."}, 400)

    query_format_string = """
        select {id_col} as id, {title_col} as title,
            mitcxi_asArray(Box2D(ST_Transform({geom_col}, 4326))) as bbox,
                mitcxi_asArray(pole_of_inaccessibility) as pole_of_inaccessibility,
                place_name as subtitle, relevance
            from (values {geocode_result}) as a (place_name, relevance, center),
                {schema}.{table}
            where ste_name16='South Australia' and
                ST_Intersects(
                    {geom_col}, ST_Transform(center, ST_SRID({geom_col}))
                )
            union all
        """

    # `language` is the user's desired display language. It affects the
    # subtitle derived from the Mapbox Geocoding API. It should come from a
    # browser's `navigator.languages[0]`.
    language = request.query_params.get("language", None)

    # First, get Mapbox Geocoding API results
    # TODO: Fetch `country`, `bbox`, and `types` from the Dataset
    payload = {
        "access_token": settings.MAPBOX_ACCESS_TOKEN,
        "autocomplete": "true",
        "country": ["au"],
        "bbox": [129.001337, -38.062603, 141.002956, -25.996146],
        "limit": 5,
        "types": ["postcode", "district", "place", "locality"],
    }

    if dataset == 'rochester':
        payload.update({
            "country": ["us"],
            "bbox": [-78.10, 42.89, -77.27, 43.42],
            "types": ["postcode", "district", "place", "locality", "neighborhood", "address", "poi"],
        })
        query_format_string = """
            select {id_col} as id, {title_col} as title,
                mitcxi_asArray(Box2D(ST_Transform({geom_col}, 4326))) as bbox,
                    mitcxi_asArray(ST_Centroid(ST_Transform({geom_col}, 4326))) as pole_of_inaccessibility,
                    place_name as subtitle, relevance
                from (values {geocode_result}) as a (place_name, relevance, center),
                    {schema}.{table}
                where ST_Intersects(
                        {geom_col}, ST_Transform(center, ST_SRID({geom_col}))
                    )
                union all
            """

    if language:
        payload["language"] = language
    payload = {
        k: v if not isinstance(v, list) else ",".join(str(f) for f in v)
        for k, v in payload.items()
    }
    url = f"https://api.mapbox.com/geocoding/v5/mapbox.places/{query}.json"
    r = requests.get(url, params=payload)
    if r.status_code == 200:
        features = r.json().get("features", None)
    else:
        print("Mapbox Geocoding call failed. Reason: " + r.json().get("message", None))
        features = []

    if features:
        geocode_result = sql_comma_join(
            sql.SQL("({row})").format(
                row=sql_comma_join([
                    sql.Literal(f['place_name']),
                    sql.Literal(f['relevance']),
                    sql.SQL(f"ST_Point({f['center'][0]}, {f['center'][1]}, 4326)"),
                ])
            )
            for f in features
        )

        format_options = {
            "id_col": sql.Identifier("sa2_main16"),
            "title_col": sql.Identifier("sa2_name16"),
            "geom_col": sql.Identifier("geom"),
            "geocode_result": geocode_result,
            "schema": sql.Identifier("public"),
            "table": sql.Identifier("sa2_2016_aust"),
        }

        if dataset == "rochester":
            format_options.update({
                "id_col": sql.Identifier("geoid"),
                "title_col": sql.Identifier("geoid"),
                "schema": sql.Identifier("usa_ny_rochester"),
                "table": sql.Identifier("tl_2019_36_bg"),
            })
        sql_query = sql.SQL(query_format_string).format(**format_options)
    else:
        sql_query = sql.SQL("")

    # Second, find the regions which either contain those geocoded results's
    # center coordinates or have names containing the query term, sorting
    # local name matches higher than geocoded results and sorting geocoding
    # results by the Mapbox Geocoding API's `relevance` property.
    dsn = "postgresql://{USER}:{PASSWORD}@{HOST}:{PORT}/{NAME}".format(
        **settings.DASHBOARD_DATABASE
    )
    conn = pg.connect(dsn)
    # Search shapefile table, promoting results as:
    # 1. Exact title match
    # 2. Title starts with query
    # 3. Any word following a space or hyphen starts with query
    # 4. Title contains query
    # 5. Any Mapbox Geocoding API results
    #
    # TODO: Split `ste_name16='South Australia'` bit of WHERE clause out to
    #       a sql.SQL-style Composable.
    query_format_string = """
        select {id_col} as id, {title_col} as title, 
            mitcxi_asArray(Box2D(ST_Transform({geom_col}, 4326))) as bbox,
            mitcxi_asArray(pole_of_inaccessibility) as pole_of_inaccessibility,
            {default_subtitle} as subtitle,
            1 +
            ({title_col} ~* ('^'||%(query)s||'$'))::int * 10 +
            ({title_col} ~* ('^'||%(query)s))::int +
            ({title_col} ~* ('[ -]'%(query)s))::int +
            ({title_col} ~* (%(query)s))::int as relevance
        from {table}
        where ste_name16='South Australia' and
            not ST_IsEmpty({geom_col}) and
            {title_col} ~* %(query)s
        order by relevance desc, title
    """

    format_options = {
        "id_col": sql.Identifier("sa2_main16"),
        "title_col": sql.Identifier("sa2_name16"),
        "geom_col": sql.Identifier("geom"),
        "default_subtitle": sql.Literal("SA2 Region"),
        "schema": sql.Identifier("public"),
        "table": sql.Identifier("sa2_2016_aust"),
    }

    if dataset == "rochester":
        query_format_string = """
            select {id_col} as id, {title_col} as title, 
                mitcxi_asArray(Box2D(ST_Transform({geom_col}, 4326))) as bbox,
                mitcxi_asArray(ST_Centroid(ST_Transform({geom_col}, 4326))) as pole_of_inaccessibility,
                {default_subtitle} as subtitle,
                1 +
                ({title_col} ~* ('^'||%(query)s||'$'))::int * 10 +
                ({title_col} ~* ('^'||%(query)s))::int +
                ({title_col} ~* ('[ -]'%(query)s))::int +
                ({title_col} ~* (%(query)s))::int as relevance
            from {schema}.{table}
            where not ST_IsEmpty({geom_col}) and
                {title_col} ~* %(query)s
            order by relevance desc, title
        """

        format_options = {
            "id_col": sql.Identifier("geoid"),
            "title_col": sql.Identifier("geoid"),
            "geom_col": sql.Identifier("geom"),
            "default_subtitle": sql.Literal("Census Block Group"),
            "schema": sql.Identifier("usa_ny_rochester"),
            "table": sql.Identifier("tl_2019_36_bg"),
        }

    sql_query += sql.SQL(query_format_string).format(**format_options)

    try:
        result = execute_sql(conn, sql_query, params={"query": query})
    finally:
        conn.close()

    return Response(result)


@api_view()
def geometry_for_ids(request, dataset=None):
    # The feature IDs to include
    feature_ids = request.query_params.get("ids", None)
    include_neighbors = request.query_params.get("include_neighbors", None)

    if not feature_ids:
        return Response({"error": "Need at least 1 feature id in `ids`"}, 400)

    include_neighbors = True if include_neighbors == "true" else False

    # TODO: Support requests for multiple ids
    feature_id = feature_ids.split(" ")[0]

    if dataset == 'small-business-support':
        params = {
            "table": "sa2_2016_aust",
            "geom_col": "geom",
            "pk_col": "sa2_main16",
            "where": "ste_name16='South Australia'",
        }
    elif dataset == 'new_york':
        params = {
            "table": "usa_ny_rochester.tl_2019_36_bg",
            "geom_col": "geom",
            "pk_col": "geoid",
            # 005 -- Bronx County (Bronx)
            # 047 -- Kings County (Brooklyn)
            # 061 -- New York County (Manhattan)
            # 081 -- Queens County (Queens)
            # 085 -- Richmond County (Staten Island)
            "where": "countyfp in ('005', '047', '061', '081', '085')",
        }
    elif dataset == 'rochester':
        params = {
            "table": "usa_ny_rochester.tl_2019_36_bg",
            "geom_col": "geom",
            "pk_col": "geoid",
            # 055 -- Munroe County (Rochester)
            "where": "countyfp in ('055')",
        }
    else:
        raise NotFound()

    params.update({"feature_id": feature_id})

    dsn = "postgresql://{USER}:{PASSWORD}@{HOST}:{PORT}/{NAME}".format(
        **settings.DASHBOARD_DATABASE
    )
    conn = pg.connect(dsn)

    if include_neighbors:
        # Return all features in an area 5 times as wide and 2 times as tall as
        # the requested feature's longest dimension. Suitable for display at w:h
        # ratios from 1:1 to 5:2.
        query = f"""
            with a as (
                select bbox,
                    case
                        when (width) <= 3 then 0
                        when (width) between 3 and 9 then 0.005
                        when (width) >= 9 then 0.01
                    end simplify_precision
                from {params["table"]},
                lateral (select ST_SetSRID(
                    mitcxi_scaled_bbox(
                        mitcxi_escribed_square_bbox(
                            Box2D({params["geom_col"]})
                        ), 5, 2
                    ),
                    ST_SRID({params["geom_col"]})
                ) as bbox) b,
                lateral (select ST_XMax(bbox) - ST_XMin(bbox) as width) c
                where {params["pk_col"]}=%s
                limit 1
            ),
            f as (
                select json_agg(
                    json_build_object(
                        'type',       'Feature',
                        'id',         {params["pk_col"]},
                        'geometry',   ST_AsGeoJSON(ST_Transform(
                            ST_SimplifyPreserveTopology(
                                ST_ClipByBox2D({params["geom_col"]}, bbox),
                                simplify_precision
                            ), 4326), 6)::json,
                        'properties', json_build_object()
                    )
                ) as features
                from {params["table"]}, a
                where {params["where"]}
                and bbox && {params["geom_col"]}
            )
            select json_build_object(
                'type', 'FeatureCollection',
                'bbox', mitcxi_asArray(bbox),
                'features', features
            ) as data
            from a, f"""
    else:
        # Return only the requested feature.
        query = f"""
            with a as (
                select {params["pk_col"]}, bbox, {params["geom_col"]}, 
                    case
                        when (width) <= 3 then 0
                        when (width) between 3 and 9 then 0.005
                        when (width) >= 9 then 0.01
                    end simplify_precision
                from {params["table"]},
                lateral (
                    select ST_SetSRID(
                        mitcxi_escribed_square_bbox(Box2D({params["geom_col"]})),
                    ST_SRID({params["geom_col"]})
                ) as bbox) b,
                lateral (select ST_XMax(bbox) - ST_XMin(bbox) as width) w
                where {params["pk_col"]}=%s
                limit 1
            ),
            f as (
                select json_agg(
                    json_build_object(
                        'type',       'Feature',
                        'id',         {params["pk_col"]},
                        'geometry',   ST_AsGeoJSON(ST_Transform(
                            ST_SimplifyPreserveTopology(
                                {params["geom_col"]}, simplify_precision
                            ), 4326), 6)::json,
                        'properties', json_build_object()
                    )
                ) as features
                from a
            )
            select json_build_object(
                'type', 'FeatureCollection',
                'bbox', mitcxi_asArray(bbox),
                'features', features
            ) as data
            from a, f
        """
    try:
        result = execute_sql(conn, query, params=(feature_id,))
        data = result[0]["data"]
    except IndexError:
        raise NotFound()
    finally:
        conn.close()

    return Response(data)


@api_view()
def run_algorithm(request, dataset=None, algorithm=None, **kwargs):
    if algorithm == "simulated_poi_accessibility_score":
        return simulated_poi_accessibility_score(request, **kwargs)
    else:
        raise NotFound()


def simulated_poi_accessibility_score(request, dataset=None, algorithm=None, **kwargs):
    score_type = request.query_params.get("score_type", None)
    poi_type = request.query_params.get("poi_type", None)
    cbg_geoid = request.query_params.get("cbg_geoid", None)
    num_new_pois = request.query_params.get("num_new_pois", None)

    try:
        if num_new_pois:
            num_new_pois = int(num_new_pois)
    except:
        Response({"error": "Invalid `num_new_pois`"}, 400)

    # TODO: Validate inputs

    dsn = "postgresql://{USER}:{PASSWORD}@{HOST}:{PORT}/{NAME}".format(
        **settings.DASHBOARD_DATABASE
    )

    try:
        scores = normalized_poi_accessibility_score(
            dsn,
            score_type=score_type,
            poi_type=poi_type,
            cbg_geoid=cbg_geoid,  # maybe cast as a string
            num_new_pois=num_new_pois)
    except (ValueError, IndexError):
        raise NotFound()

    return Response(scores)


class ExploreMetricView(views.APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request, dataset=None, metric=None, format=None):
        dsn = "postgresql://{USER}:{PASSWORD}@{HOST}:{PORT}/{NAME}".format(
            **settings.DASHBOARD_DATABASE
        )

        sqls = {
            "small-business-support": {
                "income_diversity": {
                    "table": "sa2_info_for_dashboard",
                    "primary_key": "sa2_code",
                    "metric": "income_diversity",
                },
                "mean_aud": {
                    "table": "sa2_info_for_dashboard",
                    "primary_key": "sa2_code",
                    "metric": "mean_aud",
                },
                "median_aud": {
                    "table": "sa2_info_for_dashboard",
                    "primary_key": "sa2_code",
                    "metric": "median_aud",
                },
                "quartile": {
                    "table": "sa2_info_for_dashboard",
                    "primary_key": "sa2_code",
                    "metric": "quartile",
                },
            },
            "new_york": {
                "median_house_income": {
                    "query": """
                        select census_block_group as id,
                            median_house_income as data
                        from usa_ny_ny.census_attributes as census
                        inner join usa_ny_ny.tl_2019_36_bg as cbg
                        on census.census_block_group=cbg.geoid
                        where countyfp in ('005', '047', '061', '081', '085')
                        and median_house_income is not null
                    """,
                },
                "per_capita_income": {
                    "query": """
                        select census_block_group as id,
                            per_capita_income as data
                        from usa_ny_ny.census_attributes as census
                        inner join usa_ny_ny.tl_2019_36_bg as cbg
                        on census.census_block_group=cbg.geoid
                        where countyfp in ('005', '047', '061', '081', '085')
                        and per_capita_income is not null
                    """,
                },
                "agg_household_income": {
                    "query": """
                        select census_block_group as id,
                            agg_household_income as data
                        from usa_ny_ny.census_attributes as census
                        inner join usa_ny_ny.tl_2019_36_bg as cbg
                        on census.census_block_group=cbg.geoid
                        where countyfp in ('005', '047', '061', '081', '085')
                        and agg_household_income is not null
                    """,
                },
                "median_age": {
                    "query": """
                        select census_block_group as id,
                            median_age as data
                        from usa_ny_ny.census_attributes as census
                        inner join usa_ny_ny.tl_2019_36_bg as cbg
                        on census.census_block_group=cbg.geoid
                        where countyfp in ('005', '047', '061', '081', '085')
                        and median_age is not null
                    """,
                },
                "visits": {
                    "query": """
                        select census_block_group as id, count(visit_count) as data
                        from usa_ny_ny.safegraph_weekly_visits
                        join safegraph_pois_to_cbgs using (placekey)
                        group by census_block_group
                    """,
                },
            },
            "rochester": {
                "median_house_income": {
                    "query": """
                        select cbg.geoid as id,
                            income as data
                        from usa_ny_rochester.demographics as demo
                        inner join usa_ny_rochester.tl_2019_36_bg as cbg
                        on demo.geoid=cbg.geoid
                        where countyfp in ('055')
                        and income is not null
                    """,
                },
                "median_age": {
                    "query": """
                        select cbg.geoid as id,
                            median_age as data
                        from usa_ny_rochester.demographics as demo
                        inner join usa_ny_rochester.tl_2019_36_bg as cbg
                        on demo.geoid=cbg.geoid
                        where countyfp in ('055')
                        and median_age is not null
                    """,
                },
                "num_house_owners_with_mortgage": {
                    "query": """
                        select cbg.geoid as id,
                            coalesce(num_house_owners_with_mortgage / NULLIF(num_house_owners, 0), 0) as data
                        from usa_ny_rochester.demographics as demo
                        inner join usa_ny_rochester.tl_2019_36_bg as cbg
                        on demo.geoid=cbg.geoid
                        where countyfp in ('055')
                        and num_house_owners_with_mortgage is not null
                    """,
                },
                "visits": {
                    "query": """
                        select poi_cbg as id, count(week_start) as data
                        from usa_ny_rochester.safegraph_visits
                        group by poi_cbg
                        order by poi_cbg
                    """,
                },
                "crime_rate": {
                    "query": """
                        select geoid as id, crime_rate_pct as data
                        from usa_ny_rochester.crime_index
                        order by geoid
                    """,
                },
                "poi_accessibility_gen": {
                    "query": """
                        select geoid as id, gen_acc_rank as data
                        from usa_ny_rochester.poi_accessibility
                        order by geoid
                    """,
                },
                "poi_accessibility_mtb_branches": {
                    "query": """
                        select geoid as id, mtb_branches_acc_rank as data
                        from usa_ny_rochester.poi_accessibility
                        order by geoid
                    """,
                },
                "poi_accessibility_mtb_atms": {
                    "query": """
                        select geoid as id, mtb_atms_acc_rank as data
                        from usa_ny_rochester.poi_accessibility
                        order by geoid
                    """,
                },
                "poi_accessibility_depository": {
                    "query": """
                        select geoid as id, depository_credit_intermediation_acc_rank as data
                        from usa_ny_rochester.poi_accessibility
                        order by geoid
                    """,
                },
                "poi_accessibility_grocery": {
                    "query": """
                        select geoid as id, grocery_and_related_product_merchant_wholesalers_acc_rank as data
                        from usa_ny_rochester.poi_accessibility
                        order by geoid
                    """,
                },
            }
        }

        params = sqls.get(dataset, None).get(metric, None)

        query = params.get("query", None)
        if not query:
            query = (
                "select {primary_key} as id, {metric} as data "
                "from {table}".format(
                    **params
                )
            )

        conn = pg.connect(dsn)
        try:
            result = execute_sql(conn, query)
        finally:
            conn.close()
        return Response(result)


class DetailView(views.APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_south_australia(self, request, pk=None, format=None):
        dsn = "postgresql://{USER}:{PASSWORD}@{HOST}:{PORT}/{NAME}".format(
            **settings.DASHBOARD_DATABASE
        )

        conn = pg.connect(dsn)

        # Shapefile info
        query = (
            "select SA2_MAIN16, SA2_5DIG16, SA2_NAME16, SA3_CODE16, "
            "SA3_NAME16, SA4_CODE16, SA4_NAME16, GCC_CODE16, GCC_NAME16, "
            "STE_CODE16, STE_NAME16, AREASQKM16 "
            f"from sa2_2016_aust where SA2_MAIN16='{pk}'"
        )
        row = execute_sql(conn, query, many=False)
        if not row:
            raise NotFound()
        result = dict(row)

        # Basic info
        query = (
            "select popfraction, earners_persons, median_age_of_earners_years, "
            "median_aud, mean_aud, income_aud, "
            "quartile, occup_diversity, gini_coefficient_no, income_diversity, "
            "bsns_growth_rate, bsns_entries, bsns_exits "
            "from sa2_info_for_dashboard "
            "where sa2_code=%(pk)s"
        )
        row = execute_sql(conn, query, params={"pk": pk}, many=False)
        if row:
            result.update(row)

        # Population
        config = {
            "table_name": "sa2_info_for_dashboard",
            "primary_key": "sa2_code",
            "id_vars": None,
            "value_name": "count",
            "var_names": ["gender"],
            "order_by": None,
            "value_vars": [
                {
                    "column": "persons_num",
                    "replacements": ["All"],
                },
                {
                    "column": "males_num",
                    "replacements": ["Male"],
                },
                {
                    "column": "females_num",
                    "replacements": ["Female"],
                },
            ],
        }
        query = build_melted_select_statement(**config)
        rows = execute_sql(conn, query, params={"pk": pk}, many=True)
        result.update({"population": rows})

        # Median Age
        config = {
            "table_name": "sa2_info_for_dashboard",
            "primary_key": "sa2_code",
            "id_vars": None,
            "value_name": "median_age",
            "var_names": ["gender"],
            "order_by": None,
            "value_vars": [
                {
                    "column": "median_persons_age",
                    "replacements": ["All"],
                },
                {
                    "column": "median_male_age",
                    "replacements": ["Male"],
                },
                {
                    "column": "median_female_age",
                    "replacements": ["Female"],
                },
            ],
        }
        query = build_melted_select_statement(**config)
        rows = execute_sql(conn, query, params={"pk": pk}, many=True)
        result.update({"median_age": rows})

        # Percent Persons Aged
        config = {
            "table_name": "sa2_info_for_dashboard",
            "primary_key": "sa2_code",
            "id_vars": None,
            "value_name": "percent",
            "var_names": ["bracket"],
            "order_by": None,
            "value_vars": [
                {
                    "column": "percentage_person_aged_0_14",
                    "replacements": ["0-14"],
                },
                {
                    "column": "percentage_person_aged_15_64",
                    "replacements": ["15-64"],
                },
                {
                    "column": "percentage_person_aged_65_plus",
                    "replacements": ["65+"],
                },
            ],
        }
        query = build_melted_select_statement(**config)
        rows = execute_sql(conn, query, params={"pk": pk}, many=True)
        result.update({"percentage_persons_aged": rows})

        # Income Quartile
        config = {
            "table_name": "sa2_info_for_dashboard",
            "primary_key": "sa2_code",
            "id_vars": None,
            "value_name": "value",
            "var_names": ["quartile"],
            "order_by": None,
            "value_vars": [
                {
                    "column": "lowest_quartile_pc",
                    "replacements": ["Lowest Quartile"],
                },
                {
                    "column": "second_quartile_pc",
                    "replacements": ["Second Quartile"],
                },
                {
                    "column": "third_quartile_pc",
                    "replacements": ["Third Quartile"],
                },
                {
                    "column": "highest_quartile_pc",
                    "replacements": ["Highest Quartile"],
                },
            ],
        }
        query = build_melted_select_statement(**config)
        rows = execute_sql(conn, query, params={"pk": pk}, many=True)
        result.update({"earners_per_quartile": rows})

        # Income Share
        config = {
            "table_name": "sa2_info_for_dashboard",
            "primary_key": "sa2_code",
            "id_vars": None,
            "value_name": "value",
            "var_names": ["top"],
            "order_by": None,
            "value_vars": [
                {
                    "column": "income_share_top_1pc",
                    "replacements": ["Top 1%"],
                },
                {
                    "column": "income_share_top_5pc",
                    "replacements": ["Top 5%"],
                },
                {
                    "column": "income_share_top_10pc",
                    "replacements": ["Top 10%"],
                },
            ],
        }
        query = build_melted_select_statement(**config)
        rows = execute_sql(conn, query, params={"pk": pk}, many=True)
        result.update({"income_share": rows})

        # Projected Population
        config = {
            "table_name": "sa2_population_and_projection",
            "primary_key": "sa2_main16",
            "id_vars": None,
            "value_name": "pop",
            "var_names": ["year"],
            "order_by": [{"column": "year", "direction": "asc"}],
            "value_vars": [
                {
                    "column": "yr_2016",
                    "replacements": ["2016"],
                },
                {
                    "column": "yr_2021",
                    "replacements": ["2021"],
                },
                {
                    "column": "yr_2026",
                    "replacements": ["2026"],
                },
                {
                    "column": "yr_2031",
                    "replacements": ["2031"],
                },
                {
                    "column": "yr_2036",
                    "replacements": ["2036"],
                },
            ],
        }
        query = build_melted_select_statement(**config)
        rows = execute_sql(conn, query, params={"pk": pk}, many=True)
        result.update({"pop_proj": rows})

        # Residential Housing
        config = {
            "table_name": "sa2_housing_prices_weekly_2021",
            "primary_key": "sa2code",
            "id_vars": None,
            "value_name": "rent",
            "var_names": ["rooms", "type"],
            "value_vars": [
                {
                    "column": "median_1br_apt",
                    "replacements": ["1BR", "Apartments"],
                },
                {
                    "column": "median_1br_h",
                    "replacements": ["1BR", "Houses"],
                },
                {
                    "column": "median_2br_apt",
                    "replacements": ["2BR", "Apartments"],
                },
                {
                    "column": "median_2br_h",
                    "replacements": ["2BR", "Houses"],
                },
                {
                    "column": "median_3br_apt",
                    "replacements": ["3BR", "Apartments"],
                },
                {
                    "column": "median_3br_h",
                    "replacements": ["3BR", "Houses"],
                },
                {
                    "column": "median_4above_apt",
                    "replacements": ["4BR+", "Apartments"],
                },
                {
                    "column": "median_4above_h",
                    "replacements": ["4BR+", "Houses"],
                },
            ],
        }
        query = build_melted_select_statement(**config)
        row = execute_sql(conn, query, params={"pk": pk}, many=True)
        if row:
            result.update({"residential_housing_median": row})

        # Financial Transactions
        config = {
            "table_name": "transaction_indices",
            "primary_key": "target_sa2",
            "id_vars": ["mcc"],
            "value_name": "normalized_value",
            "var_names": ["type"],
            "order_by": [{"column": "mcc", "direction": "asc"}],
            "value_vars": [
                {
                    "column": "avg_spent_index",
                    "replacements": ["Average Spent"],
                },
                {
                    "column": "trx_count_index",
                    "replacements": ["Count"],
                },
            ],
        }
        query = build_melted_select_statement(**config)
        rows = execute_sql(conn, query, params={"pk": pk}, many=True)
        result.update({"transactions": rows})

        # Business Counts
        config = {
            "table_name": "abr_business_count_by_division",
            "primary_key": "sa2_code",
            "id_vars": None,
            "join_vars": {
                "target_join_table": "anzsic_codes",
                "target_join_column": "code",
                "source_join_column": "industry_division_code",
                "target_select_columns": ["title"],
            },
            "value_name": "value",
            "var_names": ["year"],
            "order_by": None,  # Defaults to the order of value_vars
            "value_vars": [
                {
                    "column": "total_2017",
                    "replacements": ["2017"],
                },
                {
                    "column": "total_2018",
                    "replacements": ["2018"],
                },
                {
                    "column": "total_2019",
                    "replacements": ["2019"],
                },
                {
                    "column": "predicted_total_2020",
                    "replacements": ["2020 Predicted"],
                },
            ],
        }
        query = build_melted_select_statement(**config)
        rows = execute_sql(conn, query, params={"pk": pk}, many=True)
        result.update({"business_counts": rows})

        # Turnover vs Cost of Sales
        config = {
            "table_name": "tovscos_sa2_anzsic_output",
            "primary_key": "sa2_code_16",
            "id_vars": None,
            "join_vars": {
                "target_join_table": "anzsic_codes",
                "target_join_column": "code",
                "source_join_column": "anzsic",
                "target_select_columns": ["title"],
            },
            "value_name": "value",
            "var_names": ["type"],
            "order_by": [{"column": "title", "direction": "asc"}],
            "value_vars": [
                {
                    "column": "mean",
                    "replacements": ["mean"],
                },
            ],
        }
        query = build_melted_select_statement(**config)
        rows = execute_sql(conn, query, params={"pk": pk}, many=True)
        result.update({"to_cos": rows})

        # Business Rents
        config = {
            "table_name": "rent_sa2_anzsic_output",
            "primary_key": "sa2_code_16",
            "id_vars": None,
            "join_vars": {
                "target_join_table": "anzsic_codes",
                "target_join_column": "code",
                "source_join_column": "anzsic",
                "target_select_columns": ["title"],
            },
            "value_name": "value",
            "var_names": ["type"],
            "order_by": [{"column": "title", "direction": "asc"}],
            "value_vars": [
                {
                    "column": "mean",
                    "replacements": ["mean"],
                },
            ],
        }
        query = build_melted_select_statement(**config)
        rows = execute_sql(conn, query, params={"pk": pk}, many=True)
        result.update({"business_rents": rows})

        result["_atlas_title"] = result["sa2_name16"]
        result["_atlas_header_image"] = {
            "type": "geojson",
            "url": reverse(
                'dataset-geometry',
                kwargs={"dataset": "small-business-support"},
                request=request
            ) + f"?ids={result['sa2_main16']}&include_neighbors=true&format=json"
        }

        conn.close()
        return Response(result)

    def get_new_york(self, request, pk=None, format=None):
        dsn = "postgresql://{USER}:{PASSWORD}@{HOST}:{PORT}/{NAME}".format(
            **settings.DASHBOARD_DATABASE
        )

        conn = pg.connect(dsn)

        # Shapefile info
        query = (
            "select gid, statefp, countyfp, tractce, blkgrpce, geoid, "
            "namelsad, mtfcc, funcstat, aland, awater, intptlat, intptlon, "
            "x, y "
            "from usa_ny_ny.tl_2019_36_bg where geoid=%(pk)s"
        )
        row = execute_sql(conn, query, params={"pk": pk}, many=False)
        if not row:
            raise NotFound()
        result = dict(row)

        # Basic info
        query = (
            "select census_block_group, median_house_income, "
            "agg_household_income, per_capita_income, median_age "
            "from usa_ny_ny.census_attributes "
            "where census_block_group=%(pk)s"
        )
        row = execute_sql(conn, query, params={"pk": pk}, many=False)
        if row:
            result.update(row)

        # Population by Race
        config = {
            "table_name": "usa_ny_ny.census_attributes",
            "primary_key": "census_block_group",
            "id_vars": None,
            "value_name": "value",
            "var_names": ["race"],
            "order_by": None,
            "value_vars": [
                {
                    "column": "white_population",
                    "replacements": ["White"],
                },
                {
                    "column": "black_population",
                    "replacements": ["Black"],
                },
                {
                    "column": "asian_population",
                    "replacements": ["Asian"],
                },
                {
                    "column": "hispanic_population",
                    "replacements": ["Hispanic"],
                },
            ],
        }
        query = build_melted_select_statement(**config)
        rows = execute_sql(conn, query, params={"pk": pk}, many=True)
        result.update({"population_by_race": rows})

        # Population by Education
        config = {
            "table_name": "usa_ny_ny.census_attributes",
            "primary_key": "census_block_group",
            "id_vars": None,
            "value_name": "value",
            "var_names": ["education"],
            "order_by": None,
            "value_vars": [
                {
                    "column": "edu_bachelors",
                    "replacements": ["Bachelor's"],
                },
                {
                    "column": "edu_masters",
                    "replacements": ["Master's"],
                },
                {
                    "column": "edu_professional_prog",
                    "replacements": ["Professional Program"],
                },
                {
                    "column": "edu_phd",
                    "replacements": ["PhD"],
                },
            ],
        }
        query = build_melted_select_statement(**config)
        rows = execute_sql(conn, query, params={"pk": pk}, many=True)
        result.update({"population_by_education": rows})

        # Population by Age Bracket
        config = {
            "table_name": "usa_ny_ny.census_attributes",
            "primary_key": "census_block_group",
            "id_vars": None,
            "value_name": "count",
            "var_names": ["bracket"],
            "order_by": None,
            "value_vars": [
                {
                    "column": "t_0_10",
                    "replacements": ["0 - 10"],
                },
                {
                    "column": "t_10_14",
                    "replacements": ["10 - 14"],
                },
                {
                    "column": "t_15_19",
                    "replacements": ["15 - 19"],
                },
                {
                    "column": "t_20_24",
                    "replacements": ["20 - 24"],
                },
                {
                    "column": "t_25_29",
                    "replacements": ["25 - 29"],
                },
                {
                    "column": "t_30_24",  # TODO: check if this should instead be 30 - 34
                    "replacements": ["30 - 24"],
                },
                {
                    "column": "t_35_44",
                    "replacements": ["35 - 44"],
                },
                {
                    "column": "t_45_59",
                    "replacements": ["45 - 59"],
                },
                {
                    "column": "t_60_80",
                    "replacements": ["60 - 80"],
                },
            ],
        }
        query = build_melted_select_statement(**config)
        rows = execute_sql(conn, query, params={"pk": pk}, many=True)
        result.update({"population_by_age": rows})

        query = """
            select coalesce(
                tag,
                concat('Other ', coalesce(sub_category, top_category))
            ) as category, count(visit_count), week_start
            from safegraph_pois
                left outer join lateral
                    unnest(string_to_array(category_tags, ',')) as a(tag)
                        on true
                left outer join safegraph_pois_to_cbgs using (placekey)
                right outer join safegraph_weekly_visits using (placekey)
            where census_block_group = %(pk)s
            group by census_block_group, top_category,
                sub_category, tag, week_start
            order by category, week_start
        """
        rows = execute_sql(conn, query, params={"pk": pk}, many=True)
        result.update({"safegraph_visits_by_tag": rows})

        result["_atlas_title"] = result["geoid"]
        result["_atlas_header_image"] = {
            "type": "geojson",
            "url": reverse(
                'dataset-geometry',
                kwargs={"dataset": "new_york"},
                request=request
            ) + f"?ids={result['geoid']}&include_neighbors=true&format=json"
        }

        conn.close()
        return Response(result)

    def get_rochester(self, request, pk=None, format=None):
        dsn = "postgresql://{USER}:{PASSWORD}@{HOST}:{PORT}/{NAME}".format(
            **settings.DASHBOARD_DATABASE
        )

        conn = pg.connect(dsn)

        # Shapefile info
        query = (
            "select gid, statefp, countyfp, tractce, blkgrpce, geoid, "
            "namelsad, mtfcc, funcstat, aland, awater, intptlat, intptlon, "
            "x, y "
            "from usa_ny_rochester.tl_2019_36_bg where geoid=%(pk)s"
        )
        row = execute_sql(conn, query, params={"pk": pk}, many=False)
        if not row:
            raise NotFound()
        result = dict(row)

        # Basic info
        query = (
            "select census_block_group, median_house_income, "
            "agg_household_income, per_capita_income, median_age "
            "from usa_ny_rochester.census_attributes "
            "where census_block_group=%(pk)s"
        )
        row = execute_sql(conn, query, params={"pk": pk}, many=False)
        if row:
            result.update(row)

        # Population by Race
        config = {
            "schema_name": "usa_ny_rochester",
            "table_name": "census_attributes",
            "primary_key": "census_block_group",
            "id_vars": None,
            "value_name": "value",
            "var_names": ["race"],
            "order_by": None,
            "value_vars": [
                {
                    "column": "white_population",
                    "replacements": ["White"],
                },
                {
                    "column": "black_population",
                    "replacements": ["Black"],
                },
                {
                    "column": "asian_population",
                    "replacements": ["Asian"],
                },
                {
                    "column": "hispanic_population",
                    "replacements": ["Hispanic"],
                },
            ],
        }
        query = build_melted_select_statement(**config)
        rows = execute_sql(conn, query, params={"pk": pk}, many=True)
        result.update({"population_by_race": rows})

        # Population by Education
        config = {
            "schema_name": "usa_ny_rochester",
            "table_name": "census_attributes",
            "primary_key": "census_block_group",
            "id_vars": None,
            "value_name": "value",
            "var_names": ["education"],
            "order_by": None,
            "value_vars": [
                {
                    "column": "edu_bachelors",
                    "replacements": ["Bachelor's"],
                },
                {
                    "column": "edu_masters",
                    "replacements": ["Master's"],
                },
                {
                    "column": "edu_professional_prog",
                    "replacements": ["Professional Program"],
                },
                {
                    "column": "edu_phd",
                    "replacements": ["PhD"],
                },
            ],
        }
        query = build_melted_select_statement(**config)
        rows = execute_sql(conn, query, params={"pk": pk}, many=True)
        result.update({"population_by_education": rows})

        # Population by Age Bracket
        config = {
            "schema_name": "usa_ny_rochester",
            "table_name": "census_attributes",
            "primary_key": "census_block_group",
            "id_vars": None,
            "value_name": "count",
            "var_names": ["bracket"],
            "order_by": None,
            "value_vars": [
                {
                    "column": "t_0_10",
                    "replacements": ["0 - 10"],
                },
                {
                    "column": "t_10_14",
                    "replacements": ["10 - 14"],
                },
                {
                    "column": "t_15_19",
                    "replacements": ["15 - 19"],
                },
                {
                    "column": "t_20_24",
                    "replacements": ["20 - 24"],
                },
                {
                    "column": "t_25_29",
                    "replacements": ["25 - 29"],
                },
                {
                    "column": "t_30_24",  # TODO: check if this should instead be 30 - 34
                    "replacements": ["30 - 24"],
                },
                {
                    "column": "t_35_44",
                    "replacements": ["35 - 44"],
                },
                {
                    "column": "t_45_59",
                    "replacements": ["45 - 59"],
                },
                {
                    "column": "t_60_80",
                    "replacements": ["60 - 80"],
                },
            ],
        }
        query = build_melted_select_statement(**config)
        rows = execute_sql(conn, query, params={"pk": pk}, many=True)
        result.update({"population_by_age": rows})

        # Basic info - Rochester Demographics source
        query = (
            "select median_age as dem_median_age, total_population, income, "
            "commute_time, total_vehicles, num_family, num_house_units, "
            "house_unit_occupancy_vacant, num_house_owners, "
            "num_house_owners_with_mortgage, total_computer_internet, "
            "has_computer, has_no_internet, has_no_computer, unemployment "
            "from usa_ny_rochester.demographics "
            "where geoid=%(pk)s"
        )
        row = execute_sql(conn, query, params={"pk": pk}, many=False)
        if row:
            # Remove keys with `None` values to ensure the frontend knows
            # they're missing values and not just invalid data.
            result.update({k: v for k, v in row.items() if v is not None})

        # Population by Race - Rochester Demographics source
        config = {
            "schema_name": "usa_ny_rochester",
            "table_name": "demographics",
            "primary_key": "geoid",
            "id_vars": None,
            "value_name": "value",
            "var_names": ["race"],
            "order_by": None,
            "value_vars": [
                {
                    "column": "white_population",
                    "replacements": ["White"],
                },
                {
                    "column": "black_population",
                    "replacements": ["Black"],
                },
                {
                    "column": "asian_population",
                    "replacements": ["Asian"],
                },
                {
                    "column": "hispanic_population",
                    "replacements": ["Hispanic"],
                },
            ],
        }
        query = build_melted_select_statement(**config)
        rows = execute_sql(conn, query, params={"pk": pk}, many=True)
        result.update({"dem_population_by_race": rows})

        # Number of Vehicles - Rochester Demographics source
        config = {
            "schema_name": "usa_ny_rochester",
            "table_name": "demographics",
            "primary_key": "geoid",
            "id_vars": None,
            "value_name": "value",
            "var_names": ["num"],
            "order_by": None,
            "value_vars": [
                {
                    "column": "no_vehicles",
                    "replacements": ["0"],
                },
                {
                    "column": "num_1_vehicles",
                    "replacements": ["1"],
                },
                {
                    "column": "num_2_vehicles",
                    "replacements": ["2"],
                },
                {
                    "column": "num_3_more_vehicles",
                    "replacements": ["3+"],
                },
            ],
        }
        query = build_melted_select_statement(**config)
        rows = execute_sql(conn, query, params={"pk": pk}, many=True)
        result.update({"dem_num_vehicles": rows})

        # Number of Family Earners - Rochester Demographics source
        config = {
            "schema_name": "usa_ny_rochester",
            "table_name": "demographics",
            "primary_key": "geoid",
            "id_vars": None,
            "value_name": "value",
            "var_names": ["num"],
            "order_by": None,
            "value_vars": [
                {
                    "column": "num_family_0_earners",
                    "replacements": ["0"],
                },
                {
                    "column": "num_family_1_earners",
                    "replacements": ["1"],
                },
                {
                    "column": "num_family_2_earners",
                    "replacements": ["2"],
                },
                {
                    "column": "num_family_3_more_earners",
                    "replacements": ["3+"],
                },
            ],
        }
        query = build_melted_select_statement(**config)
        rows = execute_sql(conn, query, params={"pk": pk}, many=True)
        result.update({"dem_num_family_earners": rows})

        # Family Size - Rochester Demographics source
        config = {
            "schema_name": "usa_ny_rochester",
            "table_name": "demographics",
            "primary_key": "geoid",
            "id_vars": None,
            "value_name": "value",
            "var_names": ["size"],
            "order_by": None,
            "value_vars": [
                {
                    "column": "family_size_2",
                    "replacements": ["2"],
                },
                {
                    "column": "family_size_3",
                    "replacements": ["3"],
                },
                {
                    "column": "family_size_4",
                    "replacements": ["4"],
                },
                {
                    "column": "family_size_5",
                    "replacements": ["5"],
                },
                {
                    "column": "family_size_6",
                    "replacements": ["6"],
                },
                {
                    "column": "family_size_7",
                    "replacements": ["7"],
                },
            ],
        }
        query = build_melted_select_statement(**config)
        rows = execute_sql(conn, query, params={"pk": pk}, many=True)
        result.update({"dem_family_size": rows})

        # POI Accessibility Normalized
        config = {
            "schema_name": "usa_ny_rochester",
            "table_name": "poi_accessibility",
            "primary_key": "geoid",
            "id_vars": None,
            "value_name": "value",
            "var_names": ["category"],
            "order_by": None,
            "value_vars": [
                {
                    "column": "gen_acc_rank",
                    "replacements": ["General"]
                },
                {
                    "column": "other_amusement_and_recreation_acc_rank",
                    "replacements": ["Other Amusement and Recreation Industries"]
                },
                {
                    "column": "svcs_to_buildings_and_dwellings_acc_rank",
                    "replacements": ["Services to Buildings and Dwellings"]
                },
                {
                    "column": "personal_care_svcs_acc_rank",
                    "replacements": ["Personal Care Services"]
                },
                {
                    "column": "traveler_accommodation_acc_rank",
                    "replacements": ["Traveler Accommodation"]
                },
                {
                    "column": "gasoline_stations_acc_rank",
                    "replacements": ["Gasoline Stations"]
                },
                {
                    "column": "other_professional_scientific_and_technical_svcs_acc_rank",
                    "replacements": ["Other Professional, Scientific, and Technical Services"]
                },
                {
                    "column": "restaurants_and_other_eating_places_acc_rank",
                    "replacements": ["Restaurants and Other Eating Places"]
                },
                {
                    "column": "chemical_and_allied_products_merchant_wholesalers_acc_rank",
                    "replacements": ["Chemical and Allied Products Merchant Wholesalers"]
                },
                {
                    "column": "clothing_stores_acc_rank",
                    "replacements": ["Clothing Stores"]
                },
                {
                    "column": "beverage_manufacturing_acc_rank",
                    "replacements": ["Beverage Manufacturing"]
                },
                {
                    "column": "office_supplies_stationery_and_gift_stores_acc_rank",
                    "replacements": ["Office Supplies, Stationery, and Gift Stores"]
                },
                {
                    "column": "grocery_stores_acc_rank",
                    "replacements": ["Grocery Stores"]
                },
                {
                    "column": "furniture_stores_acc_rank",
                    "replacements": ["Furniture Stores"]
                },
                {
                    "column": "specialty_food_stores_acc_rank",
                    "replacements": ["Specialty Food Stores"]
                },
                {
                    "column": "automobile_dealers_acc_rank",
                    "replacements": ["Automobile Dealers"]
                },
                {
                    "column": "depository_credit_intermediation_acc_rank",
                    "replacements": ["Depository Credit Intermediation"]
                },
                {
                    "column": "beer_wine_and_liquor_stores_acc_rank",
                    "replacements": ["Beer, Wine, and Liquor Stores"]
                },
                {
                    "column": "automotive_repair_and_mntn_acc_rank",
                    "replacements": ["Automotive Repair and Maintenance"]
                },
                {
                    "column": "offices_of_physicians_acc_rank",
                    "replacements": ["Offices of Physicians"]
                },
                {
                    "column": "jewelry_luggage_and_leather_goods_stores_acc_rank",
                    "replacements": ["Jewelry, Luggage, and Leather Goods Stores"]
                },
                {
                    "column": "accounting_tax_pre_bookkeeping_and_payroll_svcs_acc_rank",
                    "replacements": ["Accounting, Tax Preparation, Bookkeeping, and Payroll Services"]
                },
                {
                    "column": "health_and_personal_care_stores_acc_rank",
                    "replacements": ["Health and Personal Care Stores"]
                },
                {
                    "column": "agencies_brokerages_and_other_insurance_related_acc_rank",
                    "replacements": ["Agencies, Brokerages, and Other Insurance Related Activities"]
                },
                {
                    "column": "home_furnishings_stores_acc_rank",
                    "replacements": ["Home Furnishings Stores"]
                },
                {
                    "column": "support_activities_for_road_transportation_acc_rank",
                    "replacements": ["Support Activities for Road Transportation"]
                },
                {
                    "column": "sporting_goods_hobby_and_musical_instrument_stores_acc_rank",
                    "replacements": ["Sporting Goods, Hobby, and Musical Instrument Stores"]
                },
                {
                    "column": "bakeries_and_tortilla_manufacturing_acc_rank",
                    "replacements": ["Bakeries and Tortilla Manufacturing"]
                },
                {
                    "column": "shoe_stores_acc_rank",
                    "replacements": ["Shoe Stores"]
                },
                {
                    "column": "automotive_parts_accessories_and_tire_stores_acc_rank",
                    "replacements": ["Automotive Parts, Accessories, and Tire Stores"]
                },
                {
                    "column": "lessors_of_real_estate_acc_rank",
                    "replacements": ["Lessors of Real Estate"]
                },
                {
                    "column": "other_ambulatory_health_care_svcs_acc_rank",
                    "replacements": ["Other Ambulatory Health Care Services"]
                },
                {
                    "column": "couriers_and_express_delivery_svcs_acc_rank",
                    "replacements": ["Couriers and Express Delivery Services"]
                },
                {
                    "column": "department_stores_acc_rank",
                    "replacements": ["Department Stores"]
                },
                {
                    "column": "other_personal_svcs_acc_rank",
                    "replacements": ["Other Personal Services"]
                },
                {
                    "column": "wired_and_wireless_telecommunications_carriers_acc_rank",
                    "replacements": ["Wired and Wireless Telecommunications Carriers"]
                },
                {
                    "column": "colleges_universities_and_professional_schools_acc_rank",
                    "replacements": ["Colleges, Universities, and Professional Schools"]
                },
                {
                    "column": "offices_of_dentists_acc_rank",
                    "replacements": ["Offices of Dentists"]
                },
                {
                    "column": "offices_of_other_health_practitioners_acc_rank",
                    "replacements": ["Offices of Other Health Practitioners"]
                },
                {
                    "column": "offices_of_real_estate_agents_and_brokers_acc_rank",
                    "replacements": ["Offices of Real Estate Agents and Brokers"]
                },
                {
                    "column": "drycleaning_and_laundry_svcs_acc_rank",
                    "replacements": ["Drycleaning and Laundry Services"]
                },
                {
                    "column": "building_material_and_supplies_dealers_acc_rank",
                    "replacements": ["Building Material and Supplies Dealers"]
                },
                {
                    "column": "elementary_and_secondary_schools_acc_rank",
                    "replacements": ["Elementary and Secondary Schools"]
                },
                {
                    "column": "museums_historical_sites_and_similar_institutions_acc_rank",
                    "replacements": ["Museums, Historical Sites, and Similar Institutions"]
                },
                {
                    "column": "electric_power_gen_transmission_and_distribution_acc_rank",
                    "replacements": ["Electric Power Generation, Transmission and Distribution"]
                },
                {
                    "column": "other_miscellaneous_store_retailers_acc_rank",
                    "replacements": ["Other Miscellaneous Store Retailers"]
                },
                {
                    "column": "florists_acc_rank",
                    "replacements": ["Florists"]
                },
                {
                    "column": "other_information_svcs_acc_rank",
                    "replacements": ["Other Information Services"]
                },
                {
                    "column": "motion_picture_and_video_acc_rank",
                    "replacements": ["Motion Picture and Video Industries"]
                },
                {
                    "column": "electronics_and_appliance_stores_acc_rank",
                    "replacements": ["Electronics and Appliance Stores"]
                },
                {
                    "column": "drinking_places_alcoholic_beverages_acc_rank",
                    "replacements": ["Drinking Places (Alcoholic Beverages)"]
                },
                {
                    "column": "nan_acc_rank",
                    "replacements": ["nan"]
                },
                {
                    "column": "religious_organizations_acc_rank",
                    "replacements": ["Religious Organizations"]
                },
                {
                    "column": "child_day_care_svcs_acc_rank",
                    "replacements": ["Child Day Care Services"]
                },
                {
                    "column": "other_financial_investment_activities_acc_rank",
                    "replacements": ["Other Financial Investment Activities"]
                },
                {
                    "column": "other_schools_and_instruction_acc_rank",
                    "replacements": ["Other Schools and Instruction"]
                },
                {
                    "column": "home_health_care_svcs_acc_rank",
                    "replacements": ["Home Health Care Services"]
                },
                {
                    "column": "book_stores_and_news_dealers_acc_rank",
                    "replacements": ["Book Stores and News Dealers"]
                },
                {
                    "column": "other_motor_vehicle_dealers_acc_rank",
                    "replacements": ["Other Motor Vehicle Dealers"]
                },
                {
                    "column": "used_merch_stores_acc_rank",
                    "replacements": ["Used Merchandise Stores"]
                },
                {
                    "column": "personal_and_household_goods_repair_and_mntn_acc_rank",
                    "replacements": ["Personal and Household Goods Repair and Maintenance"]
                },
                {
                    "column": "continuing_care_rtrmnt_comm_and_asst_living_fac_acc_rank",
                    "replacements": ["Continuing Care Retirement Communities and Assisted Living Facilities for the Elderly"]
                },
                {
                    "column": "medical_and_diagnostic_laboratories_acc_rank",
                    "replacements": ["Medical and Diagnostic Laboratories"]
                },
                {
                    "column": "outpatient_care_centers_acc_rank",
                    "replacements": ["Outpatient Care Centers"]
                },
                {
                    "column": "justice_public_order_and_safety_activities_acc_rank",
                    "replacements": ["Justice, Public Order, and Safety Activities"]
                },
                {
                    "column": "gen_merch_stores_incl_warehouse_clubs_superctrs_acc_rank",
                    "replacements": ["General Merchandise Stores, including Warehouse Clubs and Supercenters"]
                },
                {
                    "column": "individual_and_family_svcs_acc_rank",
                    "replacements": ["Individual and Family Services"]
                },
                {
                    "column": "automotive_equipment_rental_and_leasing_acc_rank",
                    "replacements": ["Automotive Equipment Rental and Leasing"]
                },
                {
                    "column": "warehousing_and_storage_acc_rank",
                    "replacements": ["Warehousing and Storage"]
                },
                {
                    "column": "employment_svcs_acc_rank",
                    "replacements": ["Employment Services"]
                },
                {
                    "column": "consumer_goods_rental_acc_rank",
                    "replacements": ["Consumer Goods Rental"]
                },
                {
                    "column": "executive_legislative_and_other_gen_govt_support_acc_rank",
                    "replacements": ["Executive, Legislative, and Other General Government Support"]
                },
                {
                    "column": "gambling_acc_rank",
                    "replacements": ["Gambling Industries"]
                },
                {
                    "column": "other_transit_and_ground_passenger_transportation_acc_rank",
                    "replacements": ["Other Transit and Ground Passenger Transportation"]
                },
                {
                    "column": "technical_and_trade_schools_acc_rank",
                    "replacements": ["Technical and Trade Schools"]
                },
                {
                    "column": "gen_medical_and_surgical_hospitals_acc_rank",
                    "replacements": ["General Medical and Surgical Hospitals"]
                },
                {
                    "column": "hardware_plumb_heat_equip_supplies_merch_wholesale_acc_rank",
                    "replacements": ["Hardware, and Plumbing and Heating Equipment and Supplies Merchant Wholesalers"]
                },
                {
                    "column": "building_equipment_contractors_acc_rank",
                    "replacements": ["Building Equipment Contractors"]
                },
                {
                    "column": "death_care_svcs_acc_rank",
                    "replacements": ["Death Care Services"]
                },
                {
                    "column": "waste_treatment_and_disposal_acc_rank",
                    "replacements": ["Waste Treatment and Disposal"]
                },
                {
                    "column": "administration_of_economic_programs_acc_rank",
                    "replacements": ["Administration of Economic Programs"]
                },
                {
                    "column": "steel_product_manufacturing_from_purchased_steel_acc_rank",
                    "replacements": ["Steel Product Manufacturing from Purchased Steel"]
                },
                {
                    "column": "drugs_and_druggists_sundries_merchant_wholesalers_acc_rank",
                    "replacements": ["Drugs and Druggists' Sundries Merchant Wholesalers"]
                },
                {
                    "column": "gen_rental_centers_acc_rank",
                    "replacements": ["General Rental Centers"]
                },
                {
                    "column": "amusement_parks_and_arcades_acc_rank",
                    "replacements": ["Amusement Parks and Arcades"]
                },
                {
                    "column": "commercial_industrial_machine_equip_rental_leasing_acc_rank",
                    "replacements": ["Commercial and Industrial Machinery and Equipment Rental and Leasing"]
                },
                {
                    "column": "household_appl_elec_elec_gds_merch_wholesalers_acc_rank",
                    "replacements": ["Household Appliances and Electrical and Electronic Goods Merchant Wholesalers"]
                },
                {
                    "column": "printing_and_related_support_activities_acc_rank",
                    "replacements": ["Printing and Related Support Activities"]
                },
                {
                    "column": "postal_service_acc_rank",
                    "replacements": ["Postal Service"]
                },
                {
                    "column": "other_leather_and_allied_product_manufacturing_acc_rank",
                    "replacements": ["Other Leather and Allied Product Manufacturing"]
                },
                {
                    "column": "grantmaking_and_giving_svcs_acc_rank",
                    "replacements": ["Grantmaking and Giving Services"]
                },
                {
                    "column": "machinery_equipment_and_supplies_merch_wholesalers_acc_rank",
                    "replacements": ["Machinery, Equipment, and Supplies Merchant Wholesalers"]
                },
                {
                    "column": "support_activities_for_air_transportation_acc_rank",
                    "replacements": ["Support Activities for Air Transportation"]
                },
                {
                    "column": "specialized_freight_trucking_acc_rank",
                    "replacements": ["Specialized Freight Trucking"]
                },
                {
                    "column": "electronic_and_precision_equipment_repair_and_mntn_acc_rank",
                    "replacements": ["Electronic and Precision Equipment Repair and Maintenance"]
                },
                {
                    "column": "lumber_and_other_const_materials_merch_wholesalers_acc_rank",
                    "replacements": ["Lumber and Other Construction Materials Merchant Wholesalers"]
                },
                {
                    "column": "rail_transportation_acc_rank",
                    "replacements": ["Rail Transportation"]
                },
                {
                    "column": "miscellaneous_durable_goods_merchant_wholesalers_acc_rank",
                    "replacements": ["Miscellaneous Durable Goods Merchant Wholesalers"]
                },
                {
                    "column": "lawn_and_garden_equipment_and_supplies_stores_acc_rank",
                    "replacements": ["Lawn and Garden Equipment and Supplies Stores"]
                },
                {
                    "column": "nondepository_credit_intermediation_acc_rank",
                    "replacements": ["Nondepository Credit Intermediation"]
                },
                {
                    "column": "interurban_and_rural_bus_transportation_acc_rank",
                    "replacements": ["Interurban and Rural Bus Transportation"]
                },
                {
                    "column": "investigation_and_security_svcs_acc_rank",
                    "replacements": ["Investigation and Security Services"]
                },
                {
                    "column": "spectator_sports_acc_rank",
                    "replacements": ["Spectator Sports"]
                },
                {
                    "column": "coating_engraving_heat_treating_and_allied_acts_acc_rank",
                    "replacements": ["Coating, Engraving, Heat Treating, and Allied Activities"]
                },
                {
                    "column": "rv_recreational_vehicle_parks_and_camps_acc_rank",
                    "replacements": ["RV (Recreational Vehicle) Parks and Recreational Camps"]
                },
                {
                    "column": "grocery_and_related_product_merchant_wholesalers_acc_rank",
                    "replacements": ["Grocery and Related Product Merchant Wholesalers"]
                },
                {
                    "column": "junior_colleges_acc_rank",
                    "replacements": ["Junior Colleges"]
                },
                {
                    "column": "other_miscellaneous_manufacturing_acc_rank",
                    "replacements": ["Other Miscellaneous Manufacturing"]
                },
                {
                    "column": "direct_selling_establishments_acc_rank",
                    "replacements": ["Direct Selling Establishments"]
                },
                {
                    "column": "community_food_housing_emergency_other_relief_svcs_acc_rank",
                    "replacements": ["Community Food and Housing, and Emergency and Other Relief Services"]
                },
                {
                    "column": "promoters_of_performing_arts_sports_and_sim_events_acc_rank",
                    "replacements": ["Promoters of Performing Arts, Sports, and Similar Events"]
                },
                {
                    "column": "nursing_care_fac_skilled_nursing_fac_acc_rank",
                    "replacements": ["Nursing Care Facilities (Skilled Nursing Facilities)"]
                },
                {
                    "column": "activities_related_to_credit_intermediation_acc_rank",
                    "replacements": ["Activities Related to Credit Intermediation"]
                },
                {
                    "column": "motor_vehicle_manufacturing_acc_rank",
                    "replacements": ["Motor Vehicle Manufacturing"]
                },
                {
                    "column": "urban_transit_systems_acc_rank",
                    "replacements": ["Urban Transit Systems"]
                },
                {
                    "column": "financial_all_acc_rank",
                    "replacements": ["Financial Services"]
                },
                {
                    "column": "mtb_atms_acc_rank",
                    "replacements": ["M&T ATMs"]
                },
                {
                    "column": "mtb_branches_acc_rank",
                    "replacements": ["M&T Branches"]
                },
            ],
        }
        query = build_melted_select_statement(**config)
        rows = execute_sql(conn, query, params={"pk": pk}, many=True)
        result.update({"poi_accessibility_normalized": rows})

        # POI Accessibility
        config = {
            "schema_name": "usa_ny_rochester",
            "table_name": "poi_accessibility",
            "primary_key": "geoid",
            "id_vars": None,
            "value_name": "value",
            "var_names": ["category"],
            "order_by": None,
            "value_vars": [
                {
                    "column": "gen_acc",
                    "replacements": ["General"]
                },
                {
                    "column": "other_amusement_and_recreation_acc",
                    "replacements": ["Other Amusement and Recreation Industries"]
                },
                {
                    "column": "svcs_to_buildings_and_dwellings_acc",
                    "replacements": ["Services to Buildings and Dwellings"]
                },
                {
                    "column": "personal_care_svcs_acc",
                    "replacements": ["Personal Care Services"]
                },
                {
                    "column": "traveler_accommodation_acc",
                    "replacements": ["Traveler Accommodation"]
                },
                {
                    "column": "gasoline_stations_acc",
                    "replacements": ["Gasoline Stations"]
                },
                {
                    "column": "other_professional_scientific_and_technical_svcs_acc",
                    "replacements": ["Other Professional, Scientific, and Technical Services"]
                },
                {
                    "column": "restaurants_and_other_eating_places_acc",
                    "replacements": ["Restaurants and Other Eating Places"]
                },
                {
                    "column": "chemical_and_allied_products_merchant_wholesalers_acc",
                    "replacements": ["Chemical and Allied Products Merchant Wholesalers"]
                },
                {
                    "column": "clothing_stores_acc",
                    "replacements": ["Clothing Stores"]
                },
                {
                    "column": "beverage_manufacturing_acc",
                    "replacements": ["Beverage Manufacturing"]
                },
                {
                    "column": "office_supplies_stationery_and_gift_stores_acc",
                    "replacements": ["Office Supplies, Stationery, and Gift Stores"]
                },
                {
                    "column": "grocery_stores_acc",
                    "replacements": ["Grocery Stores"]
                },
                {
                    "column": "furniture_stores_acc",
                    "replacements": ["Furniture Stores"]
                },
                {
                    "column": "specialty_food_stores_acc",
                    "replacements": ["Specialty Food Stores"]
                },
                {
                    "column": "automobile_dealers_acc",
                    "replacements": ["Automobile Dealers"]
                },
                {
                    "column": "depository_credit_intermediation_acc",
                    "replacements": ["Depository Credit Intermediation"]
                },
                {
                    "column": "beer_wine_and_liquor_stores_acc",
                    "replacements": ["Beer, Wine, and Liquor Stores"]
                },
                {
                    "column": "automotive_repair_and_mntn_acc",
                    "replacements": ["Automotive Repair and Maintenance"]
                },
                {
                    "column": "offices_of_physicians_acc",
                    "replacements": ["Offices of Physicians"]
                },
                {
                    "column": "jewelry_luggage_and_leather_goods_stores_acc",
                    "replacements": ["Jewelry, Luggage, and Leather Goods Stores"]
                },
                {
                    "column": "accounting_tax_pre_bookkeeping_and_payroll_svcs_acc",
                    "replacements": ["Accounting, Tax Preparation, Bookkeeping, and Payroll Services"]
                },
                {
                    "column": "health_and_personal_care_stores_acc",
                    "replacements": ["Health and Personal Care Stores"]
                },
                {
                    "column": "agencies_brokerages_and_other_insurance_related_acc",
                    "replacements": ["Agencies, Brokerages, and Other Insurance Related Activities"]
                },
                {
                    "column": "home_furnishings_stores_acc",
                    "replacements": ["Home Furnishings Stores"]
                },
                {
                    "column": "support_activities_for_road_transportation_acc",
                    "replacements": ["Support Activities for Road Transportation"]
                },
                {
                    "column": "sporting_goods_hobby_and_musical_instrument_stores_acc",
                    "replacements": ["Sporting Goods, Hobby, and Musical Instrument Stores"]
                },
                {
                    "column": "bakeries_and_tortilla_manufacturing_acc",
                    "replacements": ["Bakeries and Tortilla Manufacturing"]
                },
                {
                    "column": "shoe_stores_acc",
                    "replacements": ["Shoe Stores"]
                },
                {
                    "column": "automotive_parts_accessories_and_tire_stores_acc",
                    "replacements": ["Automotive Parts, Accessories, and Tire Stores"]
                },
                {
                    "column": "lessors_of_real_estate_acc",
                    "replacements": ["Lessors of Real Estate"]
                },
                {
                    "column": "other_ambulatory_health_care_svcs_acc",
                    "replacements": ["Other Ambulatory Health Care Services"]
                },
                {
                    "column": "couriers_and_express_delivery_svcs_acc",
                    "replacements": ["Couriers and Express Delivery Services"]
                },
                {
                    "column": "department_stores_acc",
                    "replacements": ["Department Stores"]
                },
                {
                    "column": "other_personal_svcs_acc",
                    "replacements": ["Other Personal Services"]
                },
                {
                    "column": "wired_and_wireless_telecommunications_carriers_acc",
                    "replacements": ["Wired and Wireless Telecommunications Carriers"]
                },
                {
                    "column": "colleges_universities_and_professional_schools_acc",
                    "replacements": ["Colleges, Universities, and Professional Schools"]
                },
                {
                    "column": "offices_of_dentists_acc",
                    "replacements": ["Offices of Dentists"]
                },
                {
                    "column": "offices_of_other_health_practitioners_acc",
                    "replacements": ["Offices of Other Health Practitioners"]
                },
                {
                    "column": "offices_of_real_estate_agents_and_brokers_acc",
                    "replacements": ["Offices of Real Estate Agents and Brokers"]
                },
                {
                    "column": "drycleaning_and_laundry_svcs_acc",
                    "replacements": ["Drycleaning and Laundry Services"]
                },
                {
                    "column": "building_material_and_supplies_dealers_acc",
                    "replacements": ["Building Material and Supplies Dealers"]
                },
                {
                    "column": "elementary_and_secondary_schools_acc",
                    "replacements": ["Elementary and Secondary Schools"]
                },
                {
                    "column": "museums_historical_sites_and_similar_institutions_acc",
                    "replacements": ["Museums, Historical Sites, and Similar Institutions"]
                },
                {
                    "column": "electric_power_gen_transmission_and_distribution_acc",
                    "replacements": ["Electric Power Generation, Transmission and Distribution"]
                },
                {
                    "column": "other_miscellaneous_store_retailers_acc",
                    "replacements": ["Other Miscellaneous Store Retailers"]
                },
                {
                    "column": "florists_acc",
                    "replacements": ["Florists"]
                },
                {
                    "column": "other_information_svcs_acc",
                    "replacements": ["Other Information Services"]
                },
                {
                    "column": "motion_picture_and_video_acc",
                    "replacements": ["Motion Picture and Video Industries"]
                },
                {
                    "column": "electronics_and_appliance_stores_acc",
                    "replacements": ["Electronics and Appliance Stores"]
                },
                {
                    "column": "drinking_places_alcoholic_beverages_acc",
                    "replacements": ["Drinking Places (Alcoholic Beverages)"]
                },
                {
                    "column": "nan_acc",
                    "replacements": ["nan"]
                },
                {
                    "column": "religious_organizations_acc",
                    "replacements": ["Religious Organizations"]
                },
                {
                    "column": "child_day_care_svcs_acc",
                    "replacements": ["Child Day Care Services"]
                },
                {
                    "column": "other_financial_investment_activities_acc",
                    "replacements": ["Other Financial Investment Activities"]
                },
                {
                    "column": "other_schools_and_instruction_acc",
                    "replacements": ["Other Schools and Instruction"]
                },
                {
                    "column": "home_health_care_svcs_acc",
                    "replacements": ["Home Health Care Services"]
                },
                {
                    "column": "book_stores_and_news_dealers_acc",
                    "replacements": ["Book Stores and News Dealers"]
                },
                {
                    "column": "other_motor_vehicle_dealers_acc",
                    "replacements": ["Other Motor Vehicle Dealers"]
                },
                {
                    "column": "used_merch_stores_acc",
                    "replacements": ["Used Merchandise Stores"]
                },
                {
                    "column": "personal_and_household_goods_repair_and_mntn_acc",
                    "replacements": ["Personal and Household Goods Repair and Maintenance"]
                },
                {
                    "column": "continuing_care_rtrmnt_comm_and_asst_living_fac_acc",
                    "replacements": ["Continuing Care Retirement Communities and Assisted Living Facilities for the Elderly"]
                },
                {
                    "column": "medical_and_diagnostic_laboratories_acc",
                    "replacements": ["Medical and Diagnostic Laboratories"]
                },
                {
                    "column": "outpatient_care_centers_acc",
                    "replacements": ["Outpatient Care Centers"]
                },
                {
                    "column": "justice_public_order_and_safety_activities_acc",
                    "replacements": ["Justice, Public Order, and Safety Activities"]
                },
                {
                    "column": "gen_merch_stores_incl_warehouse_clubs_superctrs_acc",
                    "replacements": ["General Merchandise Stores, including Warehouse Clubs and Supercenters"]
                },
                {
                    "column": "individual_and_family_svcs_acc",
                    "replacements": ["Individual and Family Services"]
                },
                {
                    "column": "automotive_equipment_rental_and_leasing_acc",
                    "replacements": ["Automotive Equipment Rental and Leasing"]
                },
                {
                    "column": "warehousing_and_storage_acc",
                    "replacements": ["Warehousing and Storage"]
                },
                {
                    "column": "employment_svcs_acc",
                    "replacements": ["Employment Services"]
                },
                {
                    "column": "consumer_goods_rental_acc",
                    "replacements": ["Consumer Goods Rental"]
                },
                {
                    "column": "executive_legislative_and_other_gen_govt_support_acc",
                    "replacements": ["Executive, Legislative, and Other General Government Support"]
                },
                {
                    "column": "gambling_acc",
                    "replacements": ["Gambling Industries"]
                },
                {
                    "column": "other_transit_and_ground_passenger_transportation_acc",
                    "replacements": ["Other Transit and Ground Passenger Transportation"]
                },
                {
                    "column": "technical_and_trade_schools_acc",
                    "replacements": ["Technical and Trade Schools"]
                },
                {
                    "column": "gen_medical_and_surgical_hospitals_acc",
                    "replacements": ["General Medical and Surgical Hospitals"]
                },
                {
                    "column": "hardware_plumb_heat_equip_supplies_merch_wholesale_acc",
                    "replacements": ["Hardware, and Plumbing and Heating Equipment and Supplies Merchant Wholesalers"]
                },
                {
                    "column": "building_equipment_contractors_acc",
                    "replacements": ["Building Equipment Contractors"]
                },
                {
                    "column": "death_care_svcs_acc",
                    "replacements": ["Death Care Services"]
                },
                {
                    "column": "waste_treatment_and_disposal_acc",
                    "replacements": ["Waste Treatment and Disposal"]
                },
                {
                    "column": "administration_of_economic_programs_acc",
                    "replacements": ["Administration of Economic Programs"]
                },
                {
                    "column": "steel_product_manufacturing_from_purchased_steel_acc",
                    "replacements": ["Steel Product Manufacturing from Purchased Steel"]
                },
                {
                    "column": "drugs_and_druggists_sundries_merchant_wholesalers_acc",
                    "replacements": ["Drugs and Druggists' Sundries Merchant Wholesalers"]
                },
                {
                    "column": "gen_rental_centers_acc",
                    "replacements": ["General Rental Centers"]
                },
                {
                    "column": "amusement_parks_and_arcades_acc",
                    "replacements": ["Amusement Parks and Arcades"]
                },
                {
                    "column": "commercial_industrial_machine_equip_rental_leasing_acc",
                    "replacements": ["Commercial and Industrial Machinery and Equipment Rental and Leasing"]
                },
                {
                    "column": "household_appl_elec_elec_gds_merch_wholesalers_acc",
                    "replacements": ["Household Appliances and Electrical and Electronic Goods Merchant Wholesalers"]
                },
                {
                    "column": "printing_and_related_support_activities_acc",
                    "replacements": ["Printing and Related Support Activities"]
                },
                {
                    "column": "postal_service_acc",
                    "replacements": ["Postal Service"]
                },
                {
                    "column": "other_leather_and_allied_product_manufacturing_acc",
                    "replacements": ["Other Leather and Allied Product Manufacturing"]
                },
                {
                    "column": "grantmaking_and_giving_svcs_acc",
                    "replacements": ["Grantmaking and Giving Services"]
                },
                {
                    "column": "machinery_equipment_and_supplies_merch_wholesalers_acc",
                    "replacements": ["Machinery, Equipment, and Supplies Merchant Wholesalers"]
                },
                {
                    "column": "support_activities_for_air_transportation_acc",
                    "replacements": ["Support Activities for Air Transportation"]
                },
                {
                    "column": "specialized_freight_trucking_acc",
                    "replacements": ["Specialized Freight Trucking"]
                },
                {
                    "column": "electronic_and_precision_equipment_repair_and_mntn_acc",
                    "replacements": ["Electronic and Precision Equipment Repair and Maintenance"]
                },
                {
                    "column": "lumber_and_other_const_materials_merch_wholesalers_acc",
                    "replacements": ["Lumber and Other Construction Materials Merchant Wholesalers"]
                },
                {
                    "column": "rail_transportation_acc",
                    "replacements": ["Rail Transportation"]
                },
                {
                    "column": "miscellaneous_durable_goods_merchant_wholesalers_acc",
                    "replacements": ["Miscellaneous Durable Goods Merchant Wholesalers"]
                },
                {
                    "column": "lawn_and_garden_equipment_and_supplies_stores_acc",
                    "replacements": ["Lawn and Garden Equipment and Supplies Stores"]
                },
                {
                    "column": "nondepository_credit_intermediation_acc",
                    "replacements": ["Nondepository Credit Intermediation"]
                },
                {
                    "column": "interurban_and_rural_bus_transportation_acc",
                    "replacements": ["Interurban and Rural Bus Transportation"]
                },
                {
                    "column": "investigation_and_security_svcs_acc",
                    "replacements": ["Investigation and Security Services"]
                },
                {
                    "column": "spectator_sports_acc",
                    "replacements": ["Spectator Sports"]
                },
                {
                    "column": "coating_engraving_heat_treating_and_allied_acts_acc",
                    "replacements": ["Coating, Engraving, Heat Treating, and Allied Activities"]
                },
                {
                    "column": "rv_recreational_vehicle_parks_and_camps_acc",
                    "replacements": ["RV (Recreational Vehicle) Parks and Recreational Camps"]
                },
                {
                    "column": "grocery_and_related_product_merchant_wholesalers_acc",
                    "replacements": ["Grocery and Related Product Merchant Wholesalers"]
                },
                {
                    "column": "junior_colleges_acc",
                    "replacements": ["Junior Colleges"]
                },
                {
                    "column": "other_miscellaneous_manufacturing_acc",
                    "replacements": ["Other Miscellaneous Manufacturing"]
                },
                {
                    "column": "direct_selling_establishments_acc",
                    "replacements": ["Direct Selling Establishments"]
                },
                {
                    "column": "community_food_housing_emergency_other_relief_svcs_acc",
                    "replacements": ["Community Food and Housing, and Emergency and Other Relief Services"]
                },
                {
                    "column": "promoters_of_performing_arts_sports_and_sim_events_acc",
                    "replacements": ["Promoters of Performing Arts, Sports, and Similar Events"]
                },
                {
                    "column": "nursing_care_fac_skilled_nursing_fac_acc",
                    "replacements": ["Nursing Care Facilities (Skilled Nursing Facilities)"]
                },
                {
                    "column": "activities_related_to_credit_intermediation_acc",
                    "replacements": ["Activities Related to Credit Intermediation"]
                },
                {
                    "column": "motor_vehicle_manufacturing_acc",
                    "replacements": ["Motor Vehicle Manufacturing"]
                },
                {
                    "column": "urban_transit_systems_acc",
                    "replacements": ["Urban Transit Systems"]
                },
                {
                    "column": "financial_all_acc",
                    "replacements": ["Financial Services"]
                },
                {
                    "column": "mtb_atms_acc",
                    "replacements": ["M&T ATMs"]
                },
                {
                    "column": "mtb_branches_acc",
                    "replacements": ["M&T Branches"]
                },
            ],
        }
        query = build_melted_select_statement(**config)
        rows = execute_sql(conn, query, params={"pk": pk}, many=True)
        result.update({"poi_accessibility": rows})

        # Crime Rate
        query = (
            "select crime_rate, crime_rate_pct "
            "from usa_ny_rochester.crime_index "
            "where geoid=%(pk)s"
        )
        row = execute_sql(conn, query, params={"pk": pk}, many=False)
        if row:
            result.update(row)

        query = """
            select
                coalesce(top_category, 'Unspecified') as category,
                count(1),
                visits.week_start
            from usa_ny_rochester.safegraph_visits as visits
            left join usa_ny_rochester.safegraph_pois as pois
            using (safegraph_place_id)
            where poi_cbg = %(pk)sand week_start > '2018-12-31' and week_start < '2019-07-01'
            group by poi_cbg, category, week_start
            order by category, week_start;
        """
        rows = execute_sql(conn, query, params={"pk": pk}, many=True)
        result.update({"safegraph_visits_by_tag": rows})

        result["_atlas_title"] = result["geoid"]
        result["_atlas_header_image"] = {
            "type": "geojson",
            "url": reverse(
                'dataset-geometry',
                kwargs={"dataset": "rochester"},
                request=request
            ) + f"?ids={result['geoid']}&include_neighbors=true&format=json"
        }

        conn.close()
        return Response(result)

    def get(self, request, dataset=None, pk=None, format=None):
        if dataset == 'small-business-support':
            result = self.get_south_australia(request, pk, format)
        elif dataset == 'new_york':
            result = self.get_new_york(request, pk, format)
        elif dataset == 'rochester':
            result = self.get_rochester(request, pk, format)
        else:
            raise NotFound()
        return result
