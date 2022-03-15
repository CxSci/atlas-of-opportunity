FROM postgis/postgis:14-3.2

# Install postgis CLI tools on the server so shp2pgsql is available for the
# entrypoint scripts.
RUN apt-get update && \
    apt-get install -y postgis && \
    apt-get clean && \
    rm -rf /var/cache/apt/lists

# Add recursive init script
ADD ./scripts/init.sh /docker-entrypoint-initdb.d/20_init.sh
