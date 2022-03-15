# South Australia Dataset

Some of the data necessary for the Atlas to run is not included in this repository and must be downloaded separately.

1. Download "Statistical Area Level 2 (SA2) ASGS Ed 2016 Digital Boundaries in
    # ESRI Shapefile Format" from https://www.abs.gov.au/AUSSTATS/abs@.nsf/DetailsPage/1270.0.55.001July%202016?OpenDocument.

2. Unzip that file to the sources folder here. You should end up with a folder at `data/south_australia/1270055001_sa2_2016_aust_shape` containing `SA2_2016_AUST.shp`, among other files.

That shapefile is imported into the PostGIS database at start time by the script at `docker-entrypoint-scripts/30_shp2pgsql.sh`.
