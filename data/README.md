# Atlas of Opportunity Data

Data in the Atlas of Opportunity is grouped by region. To add a new region, create a new folder here and add data as described below.

## Adding geographic data

The Atlas needs to store geographic data in two places: simplified as [Mapbox vector tiles](https://docs.mapbox.com/api/maps/vector-tiles/) and with full detail in its own PostGIS database. The Atlas uses Mapbox's paid vector tile hosting service, which allows the Atlas to efficiently display arbitrarily complex geometries.

To minimize hosting costs, Mapbox should only be used to host simplified regional boundaries. All other data should live in the Atlas's PostGIS database. 

### Working with Mapbox vector tiles

While it's possible to create tilesets by uploading GeoJSON directly to Mapbox Studio, it is recommended to use [Mapbox Tiling Service (MTS)](https://docs.mapbox.com/mapbox-tiling-service/guides/), which provides finer control over the result.

These instructions assume the use of [Tilesets CLI](https://github.com/mapbox/tilesets-cli/).

#### Creating a tileset

The follow is just the steps from [Create a New Tileset with MTS](https://docs.mapbox.com/mapbox-tiling-service/guides/#create-a-new-tileset-with-mts), tailored to the use of Tilesets CLI and this project's South Australia dataset.

##### Prepare source data

1. If using shapefiles, convert them to GeoJSON first. MTS only accepts GeoJSON.
    ```sh
    cd south_australia/sources
    unzip 1270055001_sa2_2016_aust_shape.zip \
        -d 1270055001_sa2_2016_aust_shape
    docker pull osgeo/gdal
    # Create south_australia/sources/SA_SA2s.geojson.
    # `-where` clause filters out SA2s not in South Australia.
    docker run --rm -v "$(pwd)":/tmp/sources \
        osgeo/gdal ogr2ogr \
            -f "GeoJSON" \
            -where "STE_NAME16='South Australia'" \
            /tmp/sources/SA_SA2s.geojson \
            /tmp/sources/1270055001_sa2_2016_aust_shape/SA2_2016_AUST.shp
    ```

2. Remove any geometry-free GeoJSON features.

    Vector tiles are for features with displayable geometry, and Tilesets CLI fails if any GeoJSON features lack geometry. There are two such SA2s in the South Australian dataset. 

    Validate GeoJSON:

    ```sh
    cd south_australia/sources
    tilesets validate-source SA_SA2s.geojson
    ```

    Clean GeoJSON:

    ```sh
    cd south_australia/sources
    python3 ../../scripts/clean_geojson.py -i SA_SA2s.geojson --in-place
    ```

##### Create a tileset source
1. Optional. Estimate how much of your [Mapbox Tileset quotas](https://www.mapbox.com/pricing#tilesets) this source will use up.
    ```sh
    tilesets estimate-area -p 10m south_australia/SA_SA2s.geojson
    ```

2. Upload the GeoJSON file to MTS. Replace `$username` with your Mapbox username and `$id` with your desired tileset source id.
    ```sh
    tilesets upload-source $username $id south_australia/SA_SA2s.geojson
    ```

##### Create an MTS recipe

##### Upload the recipe

##### Start a job to create or update a tileset using the recipe

##### Publish tileset

#### What to do with that in Mapbox Studio

#### Where to put that tileset id into the Atlas

### Working with PostGIS

The Atlas uses a dockerized PostGIS server with entrypoint scripts to automate the basic loading of datasets.

TODO: Explain that everything below should be defined as entrypoint scripts.

#### Importing geographic data

##### Import ESRI shapefiles

If your data is in shapefile format, you can import it into PostGIS using shp2pgsql, which comes as part of the PostGIS command line tools. The South Australia dataset includes an example in [shp2pgsql.sh]().

TODO: Try doing this with ogr2ogr instead of shp2pgsql.

##### Import GeoJSON

TODO: Explain how to import GeoJSON files into PostGIS. Probably via ogr2ogr or GeoPandas.

#### Extra columns

The Atlas needs some specific columns beyond what would be available in typical boundary data. The Atlas adds these extra columns during startup if they are missing.

- `pole_of_inaccessibility`: Used for positioning labels and visualizations on the region. Derived from the `geom` geometry column.


## Adding other data

### Importing CSVs

#### Create an import script

TODO: Explain that each region folder needs a docker-entrypoint-scripts folder with its own import_csvs.sql file.


## Testing the database

The Atlas uses a dockerized PostGIS database. It runs automatically when the project is spun up with `docker-compose up` from the Atlas project's root folder. For development and testing, the database can be run without the frontend by running `docker-compose up postgis`. The database can be inspected by running `docker-compose run --rm psql`.