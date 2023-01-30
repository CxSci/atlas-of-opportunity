# Atlas of Opportunity Server Administration

## Hosting Environment

The Atlas is structured like a typical modern web application with a frontend client, a backend server, and a supporting database. A development environment might use one machine to run all services, but production environments should use a separate machine for each service.

The Atlas is dockerized software, meaning its services can be built and deployed in nearly any environment while remaining isolated from other services in that environment. Any system capable of running [Docker](https://www.docker.com) should be able to run the Atlas of Opportunity. It is possible, but not recommended, to run each service directly on a host machine without Docker, as using Docker reduces the chances for bugs caused by differences between server environments.


### Development Environment

The Atlas is configured to run in a development environment by default. To start a server with a default dataset, simply checkout the code from its repo on GitHub and build and run the project's default Docker Compose configuration:

```sh
git clone https://github.com/CxSci/atlas-of-opportunity.git atlas
cd atlas
docker compose up -d
```

Building the Docker images only needs to happen once but will likely take several minutes to complete. Running the project for the first time includes database imports, precomputation of some models, and compilation of the frontend for development mode which will also likely take several minutes.

When all of the containers have finished starting up, a development version of the frontend should be reachable at [http://localhost:3000/](http://localhost:3000/), the backend at [http://localhost:8000/](http://localhost:8000/), and the database at [http://localhost:5432/](http://localhost:5432/).

### Production Environment

The recommended setup for production environments is a high-availability, managed database and redundant machines for the frontend and backend, all proxied behind a load balancer. MIT Connection Science uses AWS for its own production deployment of the Atlas, but that is not an endorsement of AWS over other hosting solutions.

#### AWS Environment Setup

A full Atlas production environment in AWS consists of an Application Load Balancer (ALB), at least 2 EC2 instances, and an Amazon Aurora PostgreSQL database.

1. Create a VPC for the EC2 instances and ALB.

    - Resources to create: "VPC and more".
    - Number of Availability Zones (AZs): At least 2
    - Number of public subnets: Same as AZ count
    - Number of private subnets: Same as AZ count

2. Create 2+ EC2 instances.

    The instance's number of cores, RAM, and storage needed will depend on your particular deployment's needs.

    - AMI: Ubuntu 22.04 64-bit (x86)
    - Instance type: t2.medium or greater
    - VPC: Choose the VPC created above.
    - Subnet: Choose a public subnet in the VPC.
    - Security group:
        - Inbound ports 22 and 80 open to all.
    - Storage: 20 GB should be sufficient
    - Termination protection: Enable
    - Stop protection: Enable

3. Create a target group.
    - Target type: Instances
    - Protocol: HTTP:80
    - VPC: Choose the VPC created above.
    - Instance: Choose the EC2 instance created above.

4. Create a load balancer.
    - Load balancer type: Application Load Balancer
    - Scheme: Internet-facing
    - VPC: Choose the VPC created above.
    - Mappings: Choose the VPC's AZs and their public subnets
    - Listeners:
        - One listener on HTTP:80 which redirects traffic to port 443 with a 301 status code.
        - Another listener on HTTPS:443 which forwards traffic to the target group created above. Import a server certificate here.

5. Create an RDS database.

    The database's number of cores, RAM, and storage needed will depend on your particular deployment's needs.

    - Method: Standard create
    - Engine type: Amazon Aurora
    - Edition: Amazon Aurora PostgreSQL-Compatible Edition
    - Engine version: Aurora PostgreSQL (Compatible with PostgreSQL 14.x)
    - Templates: Production
    - DB instance class: db.t3.medium or greater
    - Size: Depends on your deployment's needs.
    - Instances: the EC2 instance created above.
    - Compute resource: Connect to an EC2 compute resource
        - Select the EC2 instance created above.

## Database Configuration

Please note that database configuration is automatic for development environments. These steps should only be necessary for production environments.

1. Create the database `dashboard` and connect to it.

    The Atlas of Opportunity data looks for all spatial data in the `dashboard` database.

    ```sql
    CREATE DATABASE dashboard;
    \c dashboard;
    ```

2. Install PostGIS extensions.

    Instructions can be found in the AWS Docs under [Managing spatial data with the PostGIS extension](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Appendix.PostgreSQL.CommonDBATasks.PostGIS.html). 

3. Create the Django database and user.

    Please make sure to choose a unique password for `django_user`.

    ```sql
    -- Create django user.
    CREATE USER django_user WITH PASSWORD :'change me';
    ALTER ROLE django_user SET client_encoding TO 'utf8';
    ALTER ROLE django_user SET default_transaction_isolation TO 'read committed';
    ALTER ROLE django_user SET timezone TO 'UTC';

    -- Create django database.
    CREATE DATABASE django;
    GRANT ALL PRIVILEGES ON DATABASE django TO django_user;

    -- Allow django user to query region data.
    GRANT USAGE ON SCHEMA public TO django_user;
    GRANT SELECT ON ALL TABLES IN SCHEMA public TO django_user;
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO django_user;
    GRANT CONNECT ON DATABASE dashboard TO django_user;
    ```

4. Create a schema for each region.

    Because a single Atlas deployment may be configured to show multiple unrelated regions, it is a good idea to create separate PostgreSQL schemas for each region to prevent name collisions. For example, a schema for Rochester, NY might look like:

    ```sql
    \set schema usa_ny_rochester;
    CREATE SCHEMA :schema;
    GRANT USAGE ON SCHEMA :schema TO django_user;
    GRANT SELECT ON ALL TABLES IN SCHEMA :schema TO django_user;
    ALTER DEFAULT PRIVILEGES IN SCHEMA :schema GRANT SELECT ON TABLES TO django_user;
    ```

## Mapbox

The Atlas relies on services from [Mapbox](https://www.mapbox.com/) for some of its functionality. It makes use of [Mapbox GL JS](https://www.mapbox.com/mapbox-gljs) to display interactive maps, [Mapbox Tiling Service](https://www.mapbox.com/mts) to host vector map tiles, and [Mapbox Search](https://www.mapbox.com/search-service) to allow users to search for addresses and points of interest.

### Mapbox Hosting Fees

Mapbox charges a monthly fee for each service but also has a generous free tier for each. For smaller use cases, such as an Atlas of Opportunity covering New England with a few thousand visitors per month, Mapbox hosting fees can easily be zero. Please note that pricing for tileset hosting varies with both the size of the area covered and the level of detail required. Hosting costs can grow easily when adding new areas to deployments of the Atlas if those details are not considered.

For specifics of how Mapbox pricing works, please see https://www.mapbox.com/pricing. A typical deployment of the Atlas will use Map Loads for Web, Temporary Geocoding API, Tileset Processing, and Tileset Hosting.

### Setting up Mapbox for the Atlas

To create the Mapbox setup needed by the Atlas, 

1. Register for a Mapbox account and log into [Mapbox Studio](https://studio.mapbox.com).

2. Pare down shapefiles to only what is needed to minimize unnecessary hosting fees.

    This can be done using [ogr2ogr](https://gdal.org/programs/ogr2ogr.html), which is part of [a convenient Docker image for GDAL](https://hub.docker.com/r/osgeo/gdal). For example, if starting with the US Census Bureau's 2019 shapefile for census block groups (CBGs) in the state of New York, the following command would create a GeoJSON version of just the CBGs in Monroe County which are not entirely made of water:

    ```sh
    docker run --rm -v "$(pwd)":/tmp \
        osgeo/gdal ogr2ogr \
            -f "GeoJSON" \
            -where "statefp='36' and countyfp='055' and aland>0" \
            /tmp/tl_2019_36_055_bg.geojson \
            /tmp/tl_2019_36_bg/tl_2019_36_bg.shp
    ```

3. Upload that pare down geometry to a new tileset in Mapbox Studio.

    Mapbox may take a few minutes to process the uploaded file.

4. Copy the tileset ID for the new tileset and enter it for `MAPBOX_ACCESS_TOKEN` in the Atlas configuration files `backend/.env.production` and `frontend/.env.production`.


## Uploading Datasets

Please note that dataset uploads are automatic for development environments. These steps should only be necessary for production environments.

### Uploading Shapefiles

Every Atlas region needs at least one shapefile defining its borders. These instructions assume an installation of PostGIS on the machine being used.

1. Acquire shapefiles.

    [The US Census Bureau](https://www.census.gov/geographies/mapping-files/time-series/geo/tiger-line-file.html) is a good source for geographic boundaries in the United States. 

2. Upload shapefiles to the database.

    The shp2pgsql tool included with PostGIS can turn shapefiles into SQL statements. The example below imports the US Census Bureau's 2019 shapefile for census block groups (CBGs) in the state of New York.

    `-s` is the spatial reference system of the shapefile, discoverable from the shapefile's .prj file.  
    `-D` tells shp2pgsql to use the much faster SQL dump format.  
    `-I` tells shp2pgsql to helpfully create a spatial index on the geometry column of the created table.

    ```sh
    shp2pgsql \
        -s 6318 \
        -D -I \
        tl_2019_36_bg/tl_2019_36_bg.shp \
        usa_ny_rochester.tl_2019_36_bg \
        | psql -U postgres -h database_hostname -d dashboard -W
    ```

### Uploading CSVs

Uploading other data into the Atlas is done in the usual manner for PostgreSQL databases. Tables should be created with columns matching the CSVs to be uploaded, and then those CSVs can be uploaded via psql's `\copy` command.


## Installation

The following steps should be performed on the machines meant to host the frontend and backend.

Please note that installation is automatic for development environments. These steps should only be necessary for production environments.

1. Clone the Atlas of Opportunity GitHub repository.

    ```sh
    git clone https://github.com/CxSci/atlas-of-opportunity.git atlas
    cd atlas
    ```

2. Configure the frontend.

    In `frontend/.env.production`, set:

    - `BASE_URL` to this deployment's web URL
    - `MAPBOX_ACCESS_TOKEN` to an access token acquired from the [Mapbox account page](https://account.mapbox.com)

3. Configure the backend.

    In `backend/.env.production`, set:

    - `DJANGO_DB_HOST` and `DASHBOARD_DB_HOST` to the database's hostname
    - `DJANGO_DB_USER` and `DASHBOARD_DB_USER` to `django_user`
    - `DJANGO_DB_PASSWORD` and `DASHBOARD_DB_PASSWORD` to the database password for django_user
    - `SECRET_KEY` to something random and keep it secret
    - `ALLOWED_HOSTS` to this deployment's domain name
    - `CORS_ALLOWED_ORIGINS` to this deployment's web URL
    - `MAPBOX_ACCESS_TOKEN` to an access token acquired from the [Mapbox account page](https://account.mapbox.com)

    In `backend/api/fixtures/initial.json` and `backend/api/views.py`:

    - Find and replace instances of `http://localhost:8000/` with the base URL of this deployment.


## Running the Atlas

After preparing an Atlas environment, loading initial data into the database, and installing and configuring the Atlas services on a host, all of its services can started and stopped with Docker Compose.

As noted above, development environments can be started with:

```sh
cd atlas
docker compose up -d
```

Production builds can be started with:

```sh
cd atlas
docker compose -f docker-compose-prod.yml up -d
```

To stop the Atlas, replace `up` with `down`.
