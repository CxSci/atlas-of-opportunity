
import json
import csv

# create SA_SA2s.csv from SA_SA2s.geojson file
def createSA2sCSVFile():

    csvHeader = ['SA2_MAIN16','SA2_5DIG16','SA2_NAME16','SA3_CODE16',
                'SA3_NAME16','SA4_CODE16','SA4_NAME16','GCC_CODE16',
                'GCC_NAME16','STE_CODE16','STE_CODE16','AREASQKM16','geometry']

    geojsonFile = open('/data/SA_SA2s.geojson', 'r')
    df = json.load(geojsonFile)

    csvFile = open('/data/SA_SA2s.csv', 'w')
    # create the csv writer
    writer = csv.writer(csvFile)

    writer.writerow(csvHeader)
    for feature in df['features']:
        # write each row to the csv file
        row = []
        row.append(feature['properties']['SA2_MAIN16'])
        row.append(feature['properties']['SA2_5DIG16'])
        row.append(feature['properties']['SA2_NAME16'])
        row.append(feature['properties']['SA3_CODE16'])
        row.append(feature['properties']['SA3_NAME16'])
        row.append(feature['properties']['SA4_CODE16'])
        row.append(feature['properties']['SA4_NAME16'])
        row.append(feature['properties']['GCC_CODE16'])
        row.append(feature['properties']['GCC_NAME16'])
        row.append(feature['properties']['STE_CODE16'])
        row.append(feature['properties']['STE_NAME16'])
        row.append(feature['properties']['AREASQKM16'])
        row.append(json.dumps(feature['geometry']))

        writer.writerow(row)
    csvFile.close()
    geojsonFile.close()


createSA2sCSVFile()