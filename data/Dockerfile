FROM postgis/postgis:14-3.2

# Install postgis CLI tools on the server so shp2pgsql is available for the
# entrypoint scripts.
RUN apt-get update && \
    apt-get install -y postgis && \
    apt-get clean && \
    rm -rf /var/cache/apt/lists

# Recursive init script for adding datasets under /data/datasets/.
# Prefixed with "20_" so it comes after the postgis docker image's 10_postgis.sh.
ADD ./scripts/init.sh /docker-entrypoint-initdb.d/20_init.sh
