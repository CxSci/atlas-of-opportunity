
# Generating SA_dashboard.geojson

1. Download "Statistical Area Level 2 (SA2) ASGS Ed 2016 Digital Boundaries in ESRI Shapefile Format" from https://www.abs.gov.au/AUSSTATS/abs@.nsf/DetailsPage/1270.0.55.001July%202016?OpenDocument to this project's src/data folder.

2. Convert that ESRI Shapefile into GeoJSON.

    ```sh
    cd src/data
    unzip 1270055001_sa2_2016_aust_shape.zip \
        -d 1270055001_sa2_2016_aust_shape
    docker pull osgeo/gdal
    # -where clause to filter out SA2s not in South Australia.
    docker run --rm -v "$(pwd)":/tmp/data \
        osgeo/gdal ogr2ogr \
            -f "GeoJSON" \
            -where "STE_NAME16='South Australia'" \
            /tmp/data/SA_SA2s.geojson \
            /tmp/data/1270055001_sa2_2016_aust_shape/SA2_2016_AUST.shp
    ```

3. Merge our CSV with that GeoJSON.

    ```sh
    pip install -r requirements.txt
    cat SA_SA2s.geojson | python update_properties.py \
        SA2_info_for_dashboard.csv > SA_dashboard.geojson
    ```
