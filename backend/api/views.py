from itertools import chain

import psycopg2 as pg
from rest_framework import permissions, views, viewsets
from rest_framework.decorators import api_view
from rest_framework.exceptions import NotFound
from rest_framework.response import Response

from api.models import Dataset
from api.serializers import DatasetSerializer
from backend.settings import DASHBOARD_DATABASE


def execute_sql(conn, sql, params=None, many=True):
    with conn.cursor(cursor_factory=pg.extras.RealDictCursor) as cur:
        cur.execute(sql, params)
        if many:
            return cur.fetchall()
        else:
            return cur.fetchone()
    return None


class DatasetViewSet(viewsets.ModelViewSet):
    queryset = Dataset.objects.all()
    serializer_class = DatasetSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


@api_view()
def search_dataset(request, dataset=None):
    query = request.query_params.get("q", None)

    dsn = "postgresql://{USER}:{PASSWORD}@{HOST}:{PORT}/{NAME}".format(
        **DASHBOARD_DATABASE
    )
    conn = pg.connect(dsn)
    # TODO: This should also incorporate results from Mapbox's Search API.
    sql = """
        with t as (
                select sa2_main16, sa2_name16, pole_of_inaccessibility,
                    Box2D(ST_Transform(geom, 4326)) as bbox
                from sa2_2016_aust
                where ste_name16='South Australia'
                and to_tsvector(sa2_name16) @@ plainto_tsquery('Adelaide')
            )
            select sa2_main16 as id, sa2_name16 as title,
                array[ST_XMin(bbox), ST_YMin(bbox),
                      ST_XMax(bbox), ST_YMax(bbox)] as bbox,
            array[ST_X(pole_of_inaccessibility),
                  ST_Y(pole_of_inaccessibility)] as pole_of_inaccessibility
            from t"""
    result = execute_sql(conn, sql, params=(query,))
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
        **DASHBOARD_DATABASE
    )
    conn = pg.connect(dsn)

    if include_neighbors:
        # TODO: This search is inefficient and uses the wrong bounding box, but
        # it's sufficient for a first past.
        #
        # clipbox should be a square with its side length based on the longest
        # side of bbox.
        #
        # It would also be good to include a bbox on the FeatureCollection
        # which fits the requested ids in order to simplify figuring that out
        # in the frontend.
        sql = """with a as (
                     select Box2D(geom) as bbox
                     from sa2_2016_aust
                     where sa2_main16=%s
                 ),
                 b as (
                     select ST_MakeEnvelope(
                     (ST_XMin(bbox) - 3 * (ST_XMax(bbox) - ST_XMin(bbox))),
                     (ST_YMin(bbox) - 2 * (ST_YMax(bbox) - ST_YMin(bbox))),
                     (ST_XMax(bbox) - 3 * (ST_XMin(bbox) - ST_XMax(bbox))),
                     (ST_YMax(bbox) - 2 * (ST_YMin(bbox) - ST_YMax(bbox))),
                     4283) as clipbox
                     from a
                 )
                 select json_build_object(
                     'type', 'FeatureCollection',
                     'features', json_agg(
                         json_build_object(
                             'type',       'Feature',
                             'id',         sa2_main16,
                             'geometry',   ST_AsGeoJSON(ST_Transform(
                                 ST_SimplifyPreserveTopology(
                                     ST_ClipByBox2D(geom, clipbox), 0.0001),
                                     4326), 6)::json,
                             'properties', json_build_object()
                         )
                     )
                 ) as data
                 from sa2_2016_aust, b
                 where ST_Intersects(b.clipbox::geography, geom::geography)"""
    else:
        sql = """select json_build_object(
                    'type', 'FeatureCollection',
                    'features', json_agg(
                        json_build_object(
                            'type',       'Feature',
                            'id',         sa2_main16,
                            'geometry',   ST_AsGeoJSON(ST_Transform(
                                ST_SimplifyPreserveTopology(
                                    geom, 0.0001), 4326), 6)::json,
                            'properties', json_build_object()
                        )
                    )
                ) as data
                from sa2_2016_aust
                where sa2_main16=%s"""
    result = execute_sql(conn, sql, params=(feature_id,))
    conn.close()

    return Response(result[0]["data"])


class ExploreMetricView(views.APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request, dataset=None, metric=None, format=None):
        dsn = "postgresql://{USER}:{PASSWORD}@{HOST}:{PORT}/{NAME}".format(
            **DASHBOARD_DATABASE
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
        sql = (
            "select {primary_key} as id, {metric} as data from {table}".format(
                **params
            )
        )
        result = execute_sql(conn, sql)
        conn.close()
        return Response(result)


class DetailView(views.APIView):
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request, dataset=None, pk=None, format=None):
        dsn = "postgresql://{USER}:{PASSWORD}@{HOST}:{PORT}/{NAME}".format(
            **DASHBOARD_DATABASE
        )

        conn = pg.connect(dsn)

        shapefile_info = (
            "select SA2_MAIN16, SA2_5DIG16, SA2_NAME16, SA3_CODE16, "
            "SA3_NAME16, SA4_CODE16, SA4_NAME16, GCC_CODE16, GCC_NAME16, "
            "STE_CODE16, STE_NAME16, AREASQKM16 "
            f"from sa2_2016_aust where SA2_MAIN16='{pk}'"
        )
        row = execute_sql(conn, shapefile_info, many=False)
        if not row:
            raise NotFound()
        result = dict(row)

        basic_info = (
            "select popfraction, persons_num, males_num, females_num, "
            "median_persons_age, median_male_age, median_female_age, "
            "percentage_person_aged_0_14, percentage_person_aged_15_64, "
            "percentage_person_aged_65_plus, earners_persons, "
            "median_age_of_earners_years, median_aud, mean_aud, income_aud, "
            "quartile, occup_diversity, gini_coefficient_no, "
            "lowest_quartile_pc, second_quartile_pc, third_quartile_pc, "
            "highest_quartile_pc, income_share_top_1pc, income_share_top_5pc, "
            "income_share_top_10pc, income_diversity, bsns_growth_rate, "
            "bsns_entries, bsns_exits "
            "from sa2_info_for_dashboard "
            f"where sa2_code='{pk}'"
        )
        row = execute_sql(conn, basic_info, many=False)
        result.update(
            {
                "population": [
                    {"gender": "All", "count": row["persons_num"]},
                    {"gender": "Male", "count": row["males_num"]},
                    {"gender": "Female", "count": row["females_num"]},
                ],
                "popfraction": row["popfraction"],
                "median_age": [
                    {"gender": "All", "median_age": row["median_persons_age"]},
                    {"gender": "Male", "median_age": row["median_male_age"]},
                    {
                        "gender": "Female",
                        "median_age": row["median_female_age"],
                    },
                ],
                "percentage_persons_aged": [
                    {
                        "bracket": "0-14",
                        "percent": row["percentage_person_aged_0_14"],
                    },
                    {
                        "bracket": "15-64",
                        "percent": row["percentage_person_aged_15_64"],
                    },
                    {
                        "bracket": "65+",
                        "percent": row["percentage_person_aged_65_plus"],
                    },
                ],
                "wage_earners": row["earners_persons"],
                "median_age_of_earners_years": row[
                    "median_age_of_earners_years"
                ],
                "median_income_aud": row["median_aud"],
                "mean_income_aud": row["mean_aud"],
                "accumulate_income_aud": row["income_aud"],
                "income_quartile": row["quartile"],
                "occup_diversity": row["occup_diversity"],
                "gini_coefficient_no": row["gini_coefficient_no"],
                "earners_per_quartile": [
                    {
                        "quartile": "Lowest Quartile",
                        "value": row["lowest_quartile_pc"],
                    },
                    {
                        "quartile": "Second Quartile",
                        "value": row["second_quartile_pc"],
                    },
                    {
                        "quartile": "Third Quartile",
                        "value": row["third_quartile_pc"],
                    },
                    {
                        "quartile": "Highest Quartile",
                        "value": row["highest_quartile_pc"],
                    },
                ],
                "income_share": [
                    {"top": "Top 1%", "value": row["income_share_top_1pc"]},
                    {"top": "Top 5%", "value": row["income_share_top_5pc"]},
                    {"top": "Top 10%", "value": row["income_share_top_10pc"]},
                ],
                "income_diversity": row["income_diversity"],
                "bsns_growth_rate": row["bsns_growth_rate"],
                "bsns_entries": row["bsns_entries"],
                "bsns_exits": row["bsns_exits"],
            }
        )

        pop_proj = (
            "select * from sa2_population_and_projection "
            f"where sa2_main16='{pk}'"
        )
        row = execute_sql(conn, pop_proj, many=False)
        result.update(
            {
                "pop_proj": [
                    {"pop": row["yr_2016"], "year": "2016"},
                    {"pop": row["yr_2021"], "year": "2021"},
                    {"pop": row["yr_2026"], "year": "2026"},
                    {"pop": row["yr_2031"], "year": "2031"},
                    {"pop": row["yr_2036"], "year": "2036"},
                ],
            }
        )

        housing = (
            "select * from sa2_housing_prices_weekly_2021 "
            f"where sa2code='{pk}'"
        )
        row = execute_sql(conn, housing, many=False)
        result.update(
            {
                "residential_housing_median": [
                    {
                        "rooms": "1BR",
                        "type": "Apartments",
                        "rent": row["median_1br_apt"],
                    },
                    {
                        "rooms": "1BR",
                        "type": "Houses",
                        "rent": row["median_1br_h"],
                    },
                    {
                        "rooms": "2BR",
                        "type": "Apartments",
                        "rent": row["median_2br_apt"],
                    },
                    {
                        "rooms": "2BR",
                        "type": "Houses",
                        "rent": row["median_2br_h"],
                    },
                    {
                        "rooms": "3BR",
                        "type": "Apartments",
                        "rent": row["median_3br_apt"],
                    },
                    {
                        "rooms": "3BR",
                        "type": "Houses",
                        "rent": row["median_3br_h"],
                    },
                    {
                        "rooms": "4BR+",
                        "type": "Apartments",
                        "rent": row["median_4above_apt"],
                    },
                    {
                        "rooms": "4BR+",
                        "type": "Houses",
                        "rent": row["median_4above_h"],
                    },
                ]
            }
        )

        transactions = (
            "select * from transaction_indices "
            f"where target_sa2='{pk}' order by mcc"
        )
        rows = execute_sql(conn, transactions, many=True)
        result.update(
            {
                "transactions": chain.from_iterable(
                    (
                        [
                            {
                                "category": r["mcc"],
                                "normalized_value": r["avg_spent_index"],
                                "type": "Average Spent",
                            },
                            {
                                "category": r["mcc"],
                                "normalized_value": r["trx_count_index"],
                                "type": "Count",
                            },
                        ]
                        for r in rows
                    )
                )
            }
        )

        bsns_counts = (
            "select * from abr_business_count_by_division "
            f"where sa2_code='{pk}' order by industry_division_label"
        )
        rows = execute_sql(conn, bsns_counts, many=True)
        result.update(
            {
                "business_counts": chain.from_iterable(
                    (
                        [
                            {
                                "anzsic": r["industry_division_label"],
                                "year": "2017",
                                "value": r["total_2017"],
                            },
                            {
                                "anzsic": r["industry_division_label"],
                                "year": "2018",
                                "value": r["total_2018"],
                            },
                            {
                                "anzsic": r["industry_division_label"],
                                "year": "2019",
                                "value": r["total_2019"],
                            },
                            {
                                "anzsic": r["industry_division_label"],
                                "year": "2020 Predicted",
                                "value": r["predicted_total_2020"],
                            },
                        ]
                        for r in rows
                    )
                )
            }
        )

        tovscos = (
            "select * from tovscos_sa2_anzsic_output "
            "inner join anzsic_codes_flattened on code=anzsic "
            f"where sa2_code_16='{pk}' order by title"
        )
        rows = execute_sql(conn, tovscos, many=True)
        result.update(
            {
                "to_cos": (
                    {
                        "anzsic": r["title"],
                        "value": r["mean"],
                    }
                    for r in rows
                )
            }
        )

        bsns_rents = (
            "select * from rent_sa2_anzsic_output "
            "inner join anzsic_codes_flattened on code=anzsic "
            f"where sa2_code_16='{pk}' order by title"
        )
        rows = execute_sql(conn, bsns_rents, many=True)
        result.update(
            {
                "business_rents": (
                    {
                        "anzsic": r["title"],
                        "rent": r["mean"],
                    }
                    for r in rows
                )
            }
        )

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
