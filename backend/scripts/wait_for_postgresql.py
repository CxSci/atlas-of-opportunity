"""Wait for a truthy PostgreSQL statement to be successful"""
import argparse
from os import environ
from time import sleep
import psycopg2


def main(args):
    dbname = args.database
    params = {
        "host": environ.get("PGHOST", environ.get("PGHOSTADDR", "localhost")),
        "port": environ.get("PGPORT", 5432),
        "dbname": dbname if dbname else environ["PGDATABASE"],
        "user": environ["PGUSER"],
        "password": environ["PGPASSWORD"],
    }

    try:
        conn = psycopg2.connect(**params)
        cur = conn.cursor()
        cur.execute(args.statement)
        result = cur.fetchone()
        if isinstance(result, tuple) and result[0]:
            return True
        print("Database available, but statement is not yet true")
    except psycopg2.OperationalError:
        print("Database not yet available")
    return None


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description=(
            "Wait for a truthy SQL statement to succeed in a PostgreSQL "
            "database, polling every 5 seconds."
        )
    )
    parser.add_argument("--database", type=str, help="The database to use")
    parser.add_argument(
        "statement",
        type=str,
        help="The truthy SQL statement to attempt to execute",
    )
    parsed_args = parser.parse_args()
    while not main(parsed_args):
        sleep(5)
    print("Database ready")
