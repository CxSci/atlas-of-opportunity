from flask import Flask, request, jsonify
import psycopg2
# import geopandas as gpd
import json
import sys
# import numpy as np

from tqdm import tqdm

app = Flask(__name__)

con = psycopg2.connect(database="SADatabase",
        user="user",
        password="password",
        host="db",
        port="5432")
cur = con.cursor()

# insert data from SA_SA2s.geojson file to database

def insertDataToDatabase():      
  is_database_has_data =  cur.execute('SELECT EXISTS (SELECT 1 FROM sa2data)')
  
  if(is_database_has_data is None):
    with open('/data/SA_SA2s.geojson','r') as file:
      df = json.load(file)

      for feature in tqdm(df['features']):  
        cur.execute("""INSERT INTO sa2data VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)""",
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
            feature['properties']['STE_NAME16'],
            feature['properties']['AREASQKM16']))
        con.commit()
    
    
insertDataToDatabase()

# API endpoints
@app.route('/api/test', methods=['GET'])
def test_health():
  return {
    "field1": "Hello",
    "field2": "From Backend"
  }

@app.route('/api/features.geojson', methods=['GET'])    
def get_sa_data():
 
  cur.execute('SELECT * FROM sa2data')
  rows = cur.fetchall()
  
  json_format =[]
  for row in rows:
    json_format.append(row)


  geojson_data = {
    "type": "FeatureCollection",
    "name": "SA2_2016_AUST",
    "crs": { 
      "type": "name", 
      "properties": { 
        "name": "urn:ogc:def:crs:EPSG::4283"
      } 
    },
    "features": [
    { 
      "type": "Feature",
      "properties": {
         'SA2_MAIN16': data[0],
         'SA2_5DIG16': data[1]
        #  'SA2_NAME16': data['SA2_NAME16'],
        #  'SA3_CODE16': data['SA3_CODE16'],
        #  'SA3_NAME16': data['SA3_NAME16'],
        #  'SA4_CODE16': data['SA4_CODE16'],
        #  'SA4_NAME16': data['SA4_NAME16'],
        #  'GCC_CODE16': data['GCC_CODE16'],
        #  'GCC_NAME16': data['GCC_NAME16'],
        #  'STE_CODE16': data['STE_CODE16'],
        #  'STE_NAME16': data['STE_NAME16'],
        #  'AREASQKM16': data['AREASQKM16']
      }
    } for data in json_format]
  }
  json.dumps(geojson_data)
  return jsonify(geojson_data)

if __name__== '__main__':
    app.run(debug=True, host='0.0.0.0')

    
