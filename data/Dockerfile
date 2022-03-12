FROM postgis/postgis:14-3.2

RUN apt-get update -y
# Installing postgis CLI tools on the server is needed to make shp2pgsql
# available for the entrypoint scripts.
RUN apt-get install postgis -y
RUN apt-get clean
RUN rm -rf /var/cache/apt/lists

ADD ./south_australia/docker-entrypoint-scripts/* /docker-entrypoint-initdb.d/
