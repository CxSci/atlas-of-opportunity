#! /usr/bin/env python3

"""Wait for a truthy PostgreSQL statement to be successful"""
import argparse
from os import environ
from time import sleep
import psycopg2


def main(args):
    dbname = args.database
    params = {
        "host": environ.get("DASHBOARD_DB_HOST", "localhost"),
        "port": environ.get("DASHBOARD_DB_PORT", 5432),
        "dbname": dbname if dbname else environ["DASHBOARD_DB_NAME"],
        "user": environ["DASHBOARD_DB_USER"],
        "password": environ["DASHBOARD_DB_PASSWORD"],
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
    print("Waiting for database to be ready...")
    while not main(parsed_args):
        sleep(5)
    print("Database ready")
