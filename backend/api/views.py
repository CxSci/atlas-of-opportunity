import psycopg2 as pg
import requests
from django.conf import settings
from psycopg2 import sql
from rest_framework import permissions, views, viewsets
from rest_framework.decorators import api_view
from rest_framework.exceptions import NotFound
from rest_framework.response import Response

from api.models import Dataset
from api.serializers import DatasetSerializer


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

    query = sql.SQL("SELECT {select} FROM {table}").format(
        select=select_columns,
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

        sql_query = sql.SQL("""
        select {id_col} as id, {title_col} as title,
            mitcxi_asArray(Box2D(ST_Transform({geom_col}, 4326))) as bbox,
                mitcxi_asArray(pole_of_inaccessibility) as pole_of_inaccessibility,
                place_name as subtitle, relevance
            from (values {geocode_result}) as a (place_name, relevance, center),
                {table}
            where ste_name16='South Australia' and
                ST_Intersects(
                    {geom_col}, ST_Transform(center, ST_SRID({geom_col}))
                )
            union all
        """).format(
            id_col=sql.Identifier("sa2_main16"),
            title_col=sql.Identifier("sa2_name16"),
            geom_col=sql.Identifier("geom"),
            geocode_result=geocode_result,
            table=sql.Identifier("sa2_2016_aust"),
        )
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
    sql_query += sql.SQL("""
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
    """).format(
        id_col=sql.Identifier("sa2_main16"),
        title_col=sql.Identifier("sa2_name16"),
        geom_col=sql.Identifier("geom"),
        default_subtitle=sql.Literal("SA2 Region"),
        table=sql.Identifier("sa2_2016_aust"),
    )

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
            "table": "tl_2019_36_bg",
            "geom_col": "geom",
            "pk_col": "geoid",
            # 005 -- Bronx County (Bronx)
            # 047 -- Kings County (Brooklyn)
            # 061 -- New York County (Manhattan)
            # 081 -- Queens County (Queens)
            # 085 -- Richmond County (Staten Island)
            "where": "countyfp in ('005', '047', '061', '081', '085')",
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
                        from census_attributes
                        inner join tl_2019_36_bg
                        on census_attributes.census_block_group=tl_2019_36_bg.geoid
                        where countyfp in ('005', '047', '061', '081', '085')
                        and median_house_income is not null
                    """,
                },
                "per_capita_income": {
                    "query": """
                        select census_block_group as id,
                            per_capita_income as data
                        from census_attributes
                        inner join tl_2019_36_bg
                        on census_attributes.census_block_group=tl_2019_36_bg.geoid
                        where countyfp in ('005', '047', '061', '081', '085')
                        and per_capita_income is not null
                    """,
                },
                "agg_household_income": {
                    "query": """
                        select census_block_group as id,
                            agg_household_income as data
                        from census_attributes
                        inner join tl_2019_36_bg
                        on census_attributes.census_block_group=tl_2019_36_bg.geoid
                        where countyfp in ('005', '047', '061', '081', '085')
                        and agg_household_income is not null
                    """,
                },
                "median_age": {
                    "query": """
                        select census_block_group as id,
                            median_age as data
                        from census_attributes
                        inner join tl_2019_36_bg
                        on census_attributes.census_block_group=tl_2019_36_bg.geoid
                        where countyfp in ('005', '047', '061', '081', '085')
                        and median_age is not null
                    """,
                },
                "visits": {
                    "query": """
                        select census_block_group as id, count(visit_count) as data
                        from safegraph_weekly_visits
                        join safegraph_pois_to_cbgs using (placekey)
                        group by census_block_group
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
            "url": (
                "http://localhost:8000/datasets/small-business-support/"
                f"geometry?ids={result['sa2_main16']}&include_neighbors=true"
                "&format=json"
            ),
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
            "from tl_2019_36_bg where geoid=%(pk)s"
        )
        row = execute_sql(conn, query, params={"pk": pk}, many=False)
        if not row:
            raise NotFound()
        result = dict(row)

        # Basic info
        query = (
            "select census_block_group, median_house_income, "
            "agg_household_income, per_capita_income, median_age "
            "from census_attributes "
            "where census_block_group=%(pk)s"
        )
        row = execute_sql(conn, query, params={"pk": pk}, many=False)
        if row:
            result.update(row)

        # Population by Race
        config = {
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
            "url": (
                "http://localhost:8000/datasets/new_york/"
                f"geometry?ids={result['geoid']}&include_neighbors=true"
                "&format=json"
            ),
        }

        conn.close()
        return Response(result)

    def get(self, request, dataset=None, pk=None, format=None):
        if dataset == 'small-business-support':
            result = self.get_south_australia(request, pk, format)
        elif dataset == 'new_york':
            result = self.get_new_york(request, pk, format)
        else:
            raise NotFound()
        return result
