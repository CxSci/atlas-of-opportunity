
import psycopg2
import json
import os

print("POSTGRES_DB", os.environ.get("POSTGRES_DB"))
print("POSTGRES_USER", os.environ.get("POSTGRES_USER"))
print("POSTGRES_PASSWORD", os.environ.get("POSTGRES_PASSWORD"))
print("POSTGRES_PORT", os.environ.get("POSTGRES_PORT"))
print("POSTGRES_HOST", os.environ.get("POSTGRES_HOST"))

con = psycopg2.connect(database=os.environ.get("POSTGRES_DB"),
                       user=os.environ.get("POSTGRES_USER"),
                       password=os.environ.get("POSTGRES_PASSWORD"),
                       host=os.environ.get("POSTGRES_HOST"),
                       port=os.environ.get("POSTGRES_PORT"))
cur = con.cursor()


# insert data from SA_SA2s.geojson file to sa2data database
def insertDataToDatabase():
    is_database_not_empty = cur.execute(
        'SELECT EXISTS (SELECT 1 FROM sa2data)')
    if(is_database_not_empty):
        return

    with open('/data/SA_SA2s.geojson', 'r') as file:
        df = json.load(file)
        for feature in df['features']:
            cur.execute("""INSERT INTO sa2data VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)""",
                        (feature['properties']['SA2_MAIN16'],
                         feature['properties']['SA2_5DIG16'],
                         feature['properties']['SA2_NAME16'],
                         feature['properties']['SA3_CODE16'],
                         feature['properties']['SA3_NAME16'],
                         feature['properties']['SA4_CODE16'],
                         feature['properties']['SA4_NAME16'],
                         feature['properties']['GCC_CODE16'],
                         feature['properties']['GCC_NAME16'],
                         feature['properties']['STE_CODE16'],
                         feature['properties']['STE_CODE16'],
                         feature['properties']['AREASQKM16'],
                         json.dumps(feature['geometry'])))
            con.commit()

insertDataToDatabase()



