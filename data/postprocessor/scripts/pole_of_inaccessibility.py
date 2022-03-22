# Uses shapely.ops.polylabel to find the pole of inaccessibility for each
# feature and then creates a new table with that as a column. Gives better
# results than relying on the centroid functions of PostGIS or Turf.


import argparse
from multiprocessing import Pool, cpu_count
from os import environ
import sys

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


def add_pole_from_column(args):
    df = args[0]
    column = args[1]["column"]
    feature = df[column].item()
    df["pole_of_inaccessibility"] = find_pole_of_inaccessibility(feature)
    return df


def apply_parallel(df, func, func_args=None, tqdm_args=None):
    """A parallelized df.apply() with a progress bar.

    Expects a grouped pandas.Dataframe, the function to apply, any extra args
    to be passed along with the dataframe, and an args dict for tqdm.
    """
    with Pool(cpu_count()) as p:
        # Pack func_args into the iterable's result as a tuple to make a
        # lower-memory version of Pool's starmap.
        ret_list = list(
            tqdm(
                p.imap(func, [(group, func_args) for name, group in df]),
                **tqdm_args,
            )
        )
    return pd.concat(ret_list)


def main(args):
    print("Loading table from db...")
    # Gather PostGIS connection details from environment variables
    db_connection_url = (
        "postgresql://{user}:{password}@{host}:{port}/{dbname}".format(
            host=environ.get("PGHOST", environ.get("PGHOSTADDR", "localhost")),
            port=environ.get("PGPORT", 5432),
            dbname=environ["PGDATABASE"],
            user=environ["PGUSER"],
            password=environ["PGPASSWORD"],
        )
    )
    engine = create_engine(db_connection_url)
    table = args.table
    index_column = args.index
    geom_column = args.geom
    query = f"select * from {table}"
    try:
        df = gpd.read_postgis(query, engine)
    except ProgrammingError as e:
        print(e)
        sys.exit(1)

        df.set_index(index_column, inplace=True)

    df = apply_parallel(
        df.groupby(df.index),
        add_pole_from_column,
        func_args={"column": geom_column},
        tqdm_args={
            "total": len(df),
            "desc": "Computing poles of inaccessibility...",
        },
    )

    # GeoPandas' `to_postgis` chokes on None values, so we replace Nones with
    # empty GeometryCollections here for the transfer and then turn them into
    # nulls in PostGIS below.
    df[geom_column] = df[geom_column].apply(
        lambda x: x if x else GeometryCollection()
    )

    print("Writing new table to db...")
    try:
        df.to_postgis(table, engine, index=True, if_exists="replace")
    except ProgrammingError as e:
        print(e)
        sys.exit(1)

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
            "Adds a `pole_of_inaccessibility` column to the specified table, "
            "defined as the interior point furthest from any edge. Expensive "
            "to compute but useful for positioning labels and symbols on "
            "complex shapes."
        )
    )
    parser.add_argument(
        "--table",
        type=str,
        required=True,
        help="The name of the table to copy",
    )
    parser.add_argument(
        "--index",
        type=str,
        required=True,
        help="The name of the table's primary key column",
    )
    parser.add_argument(
        "--geom",
        type=str,
        default="geom",
        help="The name of the table's geometry column",
    )
    parsed_args = parser.parse_args()
    main(parsed_args)
