#! /bin/sh -

echo "Importing shapefile /data/sources/south_australia/1270055001_sa2_2016_aust_shape/SA2_2016_AUST.shp..."
shp2pgsql \
    -s 4283 \
    -c /datasets/south_australia/sources/1270055001_sa2_2016_aust_shape/SA2_2016_AUST.shp \
    | psql -d dashboard -U postgres
