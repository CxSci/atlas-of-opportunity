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
        print("Mapbox Geocoding call failed. " + r.json().get("message", None))
        features = []
    geocoded_table = ",".join(
        f"('{f['place_name']}', {f['relevance']}, "
        f"ST_Point({f['center'][0]}, {f['center'][1]}, 4326))"
        for f in features
    )

    # Second, find the regions which either contain those geocoded results's
    # center coordinates or have names containing the query term, sorting
    # local name matches higher than geocoded results and sorting geocoding
    # results by the Mapbox Geocoding API's `relevance` property.
    dsn = "postgresql://{USER}:{PASSWORD}@{HOST}:{PORT}/{NAME}".format(
        **settings.DASHBOARD_DATABASE
    )
    conn = pg.connect(dsn)
    # TODO: Parameterize this SQL statement to make it dataset agnostic
    """
            {
                "id": "sa2_main16",
                "title": "sa2_name16",
                "geom": "geom",
                "extra_where_condition": "ste_name16='South Australia'",
                "subtitle_default": "SA2 Region",
                "table": "sa2_2016_aust"
            }
    """
    # TODO: Make the local name search do substrings matching
    query = """
        select sa2_main16 as id, sa2_name16 as title, 
            mitcxi_asArray(Box2D(ST_Transform(geom, 4326))) as bbox,
            mitcxi_asArray(pole_of_inaccessibility) as pole_of_inaccessibility,
            'SA2 Region' as subtitle, 2 as relevance
        from sa2_2016_aust
        where ste_name16='South Australia' and
            to_tsvector(sa2_name16) @@ plainto_tsquery(%s)
        order by relevance desc, title
    """
    # Skip looking up geocoded results if there are none
    if geocoded_table:
        query = f"""
            select sa2_main16 as id, sa2_name16 as title,
                mitcxi_asArray(Box2D(ST_Transform(geom, 4326))) as bbox,
                mitcxi_asArray(pole_of_inaccessibility) as pole_of_inaccessibility,
                place_name as subtitle, relevance
            from (values {geocoded_table}) as a (place_name, relevance, center),
                sa2_2016_aust
            where ste_name16='South Australia' and
                ST_Intersects(geom, ST_Transform(center, ST_SRID(geom)))
            union all
            {query}
        """
    try:
        result = execute_sql(conn, query, params=(query,))
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

    dsn = "postgresql://{USER}:{PASSWORD}@{HOST}:{PORT}/{NAME}".format(
        **settings.DASHBOARD_DATABASE
    )
    conn = pg.connect(dsn)

    if include_neighbors:
        # Return all features in an area 5 times as wide and 2 times as tall as
        # the requested feature's longest dimension. Suitable for display at w:h
        # ratios from 1:1 to 5:2.
        query = """
            with a as (
                select bbox,
                    case
                        when (width) <= 3 then 0
                        when (width) between 3 and 9 then 0.005
                        when (width) >= 9 then 0.01
                    end simplify_precision
                from sa2_2016_aust,
                lateral (select ST_SetSRID(
                    mitcxi_scaled_bbox(
                        mitcxi_escribed_square_bbox(Box2D(geom)), 5, 2
                    ),
                    ST_SRID(geom)
                ) as bbox) b,
                lateral (select ST_XMax(bbox) - ST_XMin(bbox) as width) c
                where sa2_main16=%s
                limit 1
            ),
            f as (
                select json_agg(
                    json_build_object(
                        'type',       'Feature',
                        'id',         sa2_main16,
                        'geometry',   ST_AsGeoJSON(ST_Transform(
                            ST_SimplifyPreserveTopology(
                                ST_ClipByBox2D(geom, bbox),
                                simplify_precision
                            ), 4326), 6)::json,
                        'properties', json_build_object()
                    )
                ) as features
                from sa2_2016_aust, a
                where ste_name16='South Australia'
                and bbox && geom
            )
            select json_build_object(
                'type', 'FeatureCollection',
                'bbox', mitcxi_asArray(bbox),
                'features', features
            ) as data
            from a, f"""
    else:
        # Return only the requested feature.
        query = """
            with a as (
                select sa2_main16, bbox, geom, 
                    case
                        when (width) <= 3 then 0
                        when (width) between 3 and 9 then 0.005
                        when (width) >= 9 then 0.01
                    end simplify_precision
                from sa2_2016_aust,
                lateral (
                    select ST_SetSRID(
                        mitcxi_escribed_square_bbox(Box2D(geom)),
                    ST_SRID(geom)
                ) as bbox) b,
                lateral (select ST_XMax(bbox) - ST_XMin(bbox) as width) w
                where sa2_main16=%s
                limit 1
            ),
            f as (
                select json_agg(
                    json_build_object(
                        'type',       'Feature',
                        'id',         sa2_main16,
                        'geometry',   ST_AsGeoJSON(ST_Transform(
                            ST_SimplifyPreserveTopology(
                                geom, simplify_precision
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
                }
            }
        }

        params = sqls.get(dataset, None).get(metric, None)

        conn = pg.connect(dsn)
        query = (
            "select {primary_key} as id, {metric} as data from {table}".format(
                **params
            )
        )
        try:
            result = execute_sql(conn, query)
        finally:
            conn.close()
        return Response(result)


class DetailView(views.APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request, dataset=None, pk=None, format=None):
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
