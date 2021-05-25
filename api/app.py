from flask import Flask, jsonify
import psycopg2
from psycopg2.extras import RealDictCursor
import json
import os

app = Flask(__name__)
app.config['JSON_SORT_KEYS'] = False

con = psycopg2.connect(database=os.environ.get("POSTGRES_DB"),
                       user=os.environ.get("POSTGRES_USER"),
                       password=os.environ.get("POSTGRES_PASSWORD"),
                       host=os.environ.get("POSTGRES_HOST"),
                       port=os.environ.get("POSTGRES_PORT"))
cur = con.cursor()
dict_cur = con.cursor(cursor_factory=RealDictCursor)

# API endpoints
@app.route('/api/test', methods=['GET'])
def test_health():
    return {
        "field1": "Hello",
        "field2": "From Backend"
    }


@app.route('/api/features.geojson', methods=['GET'])
def get_sa_data():

    command = """SELECT j.* ,persons_num, median_persons_age, males_num, median_male_age, females_num, median_female_age,
        percentage_person_aged_0_14, percentage_person_aged_15_64, percentage_person_aged_65_plus, earners_persons,
        median_age_of_earners_years, gini_coefficient_no, median_aud, mean_aud, income_aud, highest_quartile_pc,
        income_share_top_5pc, third_quartile_pc, lowest_quartile_pc, income_share_top_1pc, second_quartile_pc,
        income_share_top_10pc,popfraction,quartile,occup_diversity,bsns_entries,bsns_exits,bsns_growth_rate,bridge_diversity,
        bridge_rank1,bridge_rank2,bridge_rank3,bridge_rank4,bridge_rank5,time_q1,time_q2,time_q3,time_q4,tot_time,
        fq1,fq2,fq3,fq4,income_diversity,raw_inequality,inequality,inflow_r1,inflow_r2,inflow_r3,outflow_r1,outflow_r2,outflow_r3,
        spent_r1,spent_r2,spent_r3,gain_r1,gain_r2,gain_r3,exchanged_r1,exchanged_r2,exchanged_r3
        FROM sadata c INNER JOIN sa2data j ON c.SA2_code = j.SA2_MAIN16"""

    dict_cur.execute(command)
    rows = dict_cur.fetchall()

    result = {
        "type": "FeatureCollection",
        "name": "SA2_2016_AUST",
        "crs": {
            "type": "name",
            "properties": {
                "name": "urn:ogc:def:crs:EPSG::4283"
            }
        },
        "features": []
    }

    for row in rows:
        feature = {
            "type": "Feature",
            "properties": {},
            "geometry": {}
        }

        for k in row.keys():
            if k != 'geometry':
                feature["properties"][CheckColName(k)] = row[k]
            else:
                feature["geometry"] = json.loads(row[k])


        result["features"].append(feature)
    return jsonify(result)

# check if column name is Upper case
def CheckColName(col: str) -> str:
    upper_case_cols = ['SA2_MAIN16','SA2_5DIG16','SA2_NAME16','SA3_CODE16', 'SA3_NAME16', 'SA4_CODE16',
        'SA4_NAME16','GCC_CODE16','GCC_NAME16', 'STE_CODE16','STE_NAME16','AREASQKM16']
    if col.upper() in upper_case_cols:
        return col.upper()
    else:
        return col

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
