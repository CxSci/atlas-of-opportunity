from flask import Flask, request, jsonify
import psycopg2
import json
import sys

app = Flask(__name__)

con = psycopg2.connect(database="SADatabase",
                       user="user",
                       password="password",
                       host="db",
                       port="5432")
cur = con.cursor()

# insert data from SA_SA2s.geojson file to sa2data database


def insertDataToDatabase():
    is_database_has_data =  cur.execute('SELECT EXISTS (SELECT 1 FROM sa2data)')
    if(is_database_has_data):
        return

    with open('/data/SA_SA2s.geojson', 'r') as file:
        df = json.load(file)

        for feature in df['features']:
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
                         feature['properties']['STE_CODE16'],
                         feature['properties']['AREASQKM16']))

            con.commit()

           # SA2_MAIN16 = feature['properties']['SA2_MAIN16']
            # A2_5DIG16 =  feature['properties']['SA2_5DIG16']
            # SA2_NAME16 = feature['properties']['SA2_NAME16']
            # SA3_CODE16 = feature['properties']['SA3_CODE16']
            # SA3_NAME16 = feature['properties']['SA3_NAME16']
            # SA4_CODE16 = feature['properties']['SA4_CODE16']
            # SA4_NAME16 = feature['properties']['SA4_NAME16']
            # GCC_CODE16 = feature['properties']['GCC_CODE16']
            # GCC_NAME16 = feature['properties']['GCC_NAME16']
            # STE_CODE16 = feature['properties']['STE_CODE16']
            # STE_NAME16 = feature['properties']['STE_CODE16']
            # AREASQKM16 = feature['properties']['AREASQKM16']
            # geometry   = feature['geometry']

            # command = "INSERT INTO sa2data VALUES ${A2_5DIG16},${SA2_NAME16},{SA3_CODE16},{SA3_NAME16},{SA4_CODE16},"
            # command +=" {SA4_NAME16},{GCC_CODE16},{GCC_NAME16},{STE_CODE16},{STE_CODE16},{AREASQKM16},{geometry} "

            # values= [feature['properties']['SA2_MAIN16'],
            #       feature['properties']['SA2_5DIG16'],
            #       feature['properties']['SA2_NAME16'],
            #       feature['properties']['SA3_CODE16'],
            #       feature['properties']['SA3_NAME16'],
            #       feature['properties']['SA4_CODE16'],
            #       feature['properties']['SA4_NAME16'],
            #       feature['properties']['GCC_CODE16'],
            #       feature['properties']['GCC_NAME16'],
            #       feature['properties']['STE_CODE16'],
            #       feature['properties']['STE_CODE16'],
            #       feature['properties']['AREASQKM16'],
            #       feature['geometry']]

            # command = """INSERT INTO sa2data VALUES ({},{},{},{},{},{}, {},{},{},{},{},{})""".format(*values)


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
    command = "SELECT  j.SA2_MAIN16, j.SA2_5DIG16, j.SA2_NAME16, j.SA3_CODE16, j.SA3_NAME16, j.SA4_CODE16,"
    command += " j.SA4_NAME16, j.GCC_CODE16, j.GCC_NAME16, j.STE_CODE16, j.STE_NAME16, j.AREASQKM16,"
    command += " persons_num, median_persons_age, males_num, median_male_age, females_num, median_female_age,"
    command += " percentage_person_aged_0_14, percentage_person_aged_15_64, percentage_person_aged_65_plus, earners_persons,"
    command += " median_age_of_earners_years, gini_coefficient_no, median_aud, mean_aud, income_aud, highest_quartile_pc,"
    command += " income_share_top_5pc, third_quartile_pc, lowest_quartile_pc, income_share_top_1pc, second_quartile_pc,"
    command += " income_share_top_10pc,popfraction,quartile,occup_diversity,bsns_entries,bsns_exits,bsns_growth_rate,bridge_diversity,"
    command += " bridge_rank1,bridge_rank2,bridge_rank3,bridge_rank4,bridge_rank5,time_q1,time_q2,time_q3,time_q4,tot_time,"
    command += " fq1,fq2,fq3,fq4,income_diversity,raw_inequality,inequality,inflow_r1,inflow_r2,inflow_r3,outflow_r1,outflow_r2,outflow_r3,"
    command += " spent_r1,spent_r2,spent_r3,gain_r1,gain_r2,gain_r3,exchanged_r1,exchanged_r2,exchanged_r3, j.geometry"
    command += " FROM sadata c INNER JOIN sa2data j ON c.SA2_code = j.SA2_MAIN16"

    cur.execute(command)
    rows = cur.fetchall()

    json_format = []
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
                    'SA2_5DIG16': data[1],
                    'SA2_NAME16': data[2],
                    'SA3_CODE16': data[3],
                    'SA3_NAME16': data[4],
                    'SA4_CODE16': data[5],
                    'SA4_NAME16': data[6],
                    'GCC_CODE16': data[7],
                    'GCC_NAME16': data[8],
                    'STE_CODE16': data[9],
                    'STE_NAME16': data[10],
                    'AREASQKM16': data[11],
                    'persons_num': data[12],
                    'median_persons_age': data[13],
                    'males_num': data[14],
                    'median_male_age': data[15],
                    'females_num': data[16],
                    'median_female_age': data[17],
                    'percentage_person_aged_0_14': data[18],
                    'percentage_person_aged_15_64': data[19],
                    'percentage_person_aged_65_plus': data[20],
                    'earners_persons': data[21],
                    'median_age_of_earners_years': data[22],
                    'gini_coefficient_no': data[23],
                    'median_aud': data[24],
                    'mean_aud': data[25],
                    'income_aud': data[26],
                    'highest_quartile_pc': data[27],
                    'income_share_top_5pc': data[28],
                    'third_quartile_pc': data[29],
                    'lowest_quartile_pc': data[30],
                    'income_share_top_1pc': data[31],
                    'second_quartile_pc': data[32],
                    'income_share_top_10pc': data[33],
                    'popfraction': data[34],
                    'quartile': data[35],
                    'occup_diversity': data[36],
                    'bsns_entries': data[37],
                    'bsns_exits': data[38],
                    'bsns_growth_rate': data[39],
                    'bridge_diversity': data[40],
                    'bridge_rank1': data[41],
                    'bridge_rank2': data[42],
                    'bridge_rank3': data[43],
                    'bridge_rank4': data[44],
                    'bridge_rank5': data[45],
                    'time_q1': data[46],
                    'time_q2': data[47],
                    'time_q3': data[48],
                    'time_q4': data[49],
                    'tot_time': data[50],
                    'fq1': data[51],
                    'fq2': data[52],
                    'fq3': data[53],
                    'fq4': data[54],
                    'income_diversity': data[55],
                    'raw_inequality': data[56],
                    'inequality': data[57],
                    'inflow_r1': data[58],
                    'inflow_r2': data[59],
                    'inflow_r3': data[60],
                    'outflow_r1': data[61],
                    'outflow_r2': data[62],
                    'outflow_r3': data[63],
                    'spent_r1': data[64],
                    'spent_r2': data[65],
                    'spent_r3': data[66],
                    'gain_r1': data[67],
                    'gain_r2': data[68],
                    'gain_r3': data[69],
                    'exchanged_r1': data[70],
                    'exchanged_r2': data[71],
                    'exchanged_r3': data[72]
                },
                "geometry": "Not added yet"
            } for data in json_format]
    }
    json.dumps(geojson_data)
    return jsonify(geojson_data)


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
