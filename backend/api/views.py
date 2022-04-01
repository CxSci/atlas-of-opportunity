from itertools import chain

import psycopg2 as pg
import requests
from django.conf import settings
from rest_framework import permissions, views, viewsets
from rest_framework.decorators import api_view
from rest_framework.exceptions import NotFound
from rest_framework.response import Response

from api.models import Dataset
from api.serializers import DatasetSerializer


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
        print(r.json().get("message", None))
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
    sql = """
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
        sql = f"""
            select sa2_main16 as id, sa2_name16 as title,
                mitcxi_asArray(Box2D(ST_Transform(geom, 4326))) as bbox,
                mitcxi_asArray(pole_of_inaccessibility) as pole_of_inaccessibility,
                place_name as subtitle, relevance
            from (values {geocoded_table}) as a (place_name, relevance, center),
                sa2_2016_aust
            where ste_name16='South Australia' and
                ST_Intersects(geom, ST_Transform(center, ST_SRID(geom)))
            union all
            {sql}
        """
    try:
        result = execute_sql(conn, sql, params=(query,))
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
        sql = """
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
        sql = """
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
        result = execute_sql(conn, sql, params=(feature_ids,))
    finally:
        conn.close()

    return Response(result[0]["data"])


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
        sql = (
            "select {primary_key} as id, {metric} as data from {table}".format(
                **params
            )
        )
        try:
            result = execute_sql(conn, sql)
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
        if row:
            result.update(
                {
                    "population": [
                        {"gender": "All", "count": row["persons_num"]},
                        {"gender": "Male", "count": row["males_num"]},
                        {"gender": "Female", "count": row["females_num"]},
                    ],
                    "popfraction": row["popfraction"],
                    "median_age": [
                        {
                            "gender": "All",
                            "median_age": row["median_persons_age"],
                        },
                        {
                            "gender": "Male",
                            "median_age": row["median_male_age"],
                        },
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
                        {
                            "top": "Top 10%",
                            "value": row["income_share_top_10pc"],
                        },
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
        if row:
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
        if row:
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
