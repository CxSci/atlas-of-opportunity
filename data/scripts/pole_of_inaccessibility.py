# Use shapely.ops.polylabel to find the pole of inaccessibility for each
# feature and then create a new table with that as a column. Gives better
# results than relying on the centroid methods of PostGIS or Turf.


import argparse
from multiprocessing import Pool, cpu_count

import geopandas as gpd
import pandas as pd
from shapely.geometry import Point
from shapely.geometry.collection import GeometryCollection
from shapely.ops import polylabel
from sqlalchemy import create_engine, text
from sqlalchemy.exc import ProgrammingError
from tqdm import tqdm


def find_pole_of_inaccessibility(feature):
    if not feature:
        return Point()
    if feature.type == "MultiPolygon":
        feature = max(feature.geoms, key=lambda a: a.area)
    # Stop looking once we're within 0.001° of the likely best point
    # Return a WKT instead of geometry because GeoPandas doesn't support
    # exporting tables with multiple geometry columns to PostGIS. Instead, raw
    # text is used here and then converted to geometry in PostGIS later.
    return polylabel(feature, tolerance=0.001).wkt


def pole_for_dataframe(df):
    feature = df["geom"].item()
    df["pole_of_inaccessibility"] = find_pole_of_inaccessibility(feature)
    return df


def applyParallel(dfGrouped, func, tqdm_args={}):
    with Pool(cpu_count()) as p:
        ret_list = list(
            tqdm(
                p.imap(func, [group for name, group in dfGrouped]), **tqdm_args
            )
        )
    return pd.concat(ret_list)


def main(args):
    # TODO: take the database password and the name of the table and its
    #       geometry column as input.

    print("Loading table from db...")
    db_connection_url = (
        "postgresql://postgres:postgres@localhost:5432/dashboard"
    )
    engine = create_engine(db_connection_url)
    table = args.table
    query = f"select * from {table}"
    try:
        df = gpd.read_postgis(query, engine)
    except ProgrammingError as e:
        print(e)
        exit(1)

        df.set_index("sa2_main16", inplace=True)

    df = applyParallel(
        df.groupby(df.index),
        pole_for_dataframe,
        tqdm_args={
            "total": len(df),
            "desc": "Computing poles of inaccessibility...",
        },
    )

    # GeoPandas' `to_postgis` chokes on None values, so we replace Nones with
    # empty GeometryCollections here for the transfer and then remove them in
    # PostGIS below.
    df["geom"] = df["geom"].apply(lambda x: x if x else GeometryCollection())

    print("Writing new table to db...")
    try:
        df.to_postgis(table, engine, index=True, if_exists="replace")
    except ProgrammingError as e:
        print(e)
        exit(1)

    with engine.connect() as conn:
        # Remove empty geometries used to make to_postgis work.
        conn.execute(
            text(
                f"""update {table}
                set pole_of_inaccessibility = NULL
                where pole_of_inaccessibility = 'GEOMETRYCOLLECTION EMPTY';
            """
            )
        )
        conn.execute(
            text(
                f"""alter table {table}
                alter column pole_of_inaccessibility
                    type geometry(Point,4326)
                        using ST_SetSRID(ST_GeomFromText(
                            NULLIF(pole_of_inaccessibility, 'GEOMETRYCOLLECTION EMPTY')),
                            4326);
            """  # noqa
            )
        )


if __name__ == "__main__":

    parser = argparse.ArgumentParser(
        description=(
            "Create a copy of the specified table with an additional column, "
            "`pole_of_inaccessibility`, defined as the point inside of each "
            "region furthest from any edge. Useful for positioning labels "
            "and symbols on complex regions."
        )
    )
    parser.add_argument(
        "table",
        type=str,
        help="The name of the table to copy",
    )
    args = parser.parse_args()
    main(args)
