# Atlas of Opportunity Backend Service

## Installation

Via Docker Compose (recommended):

```shell
# Run from repository root
docker-compose build api
```

Locally:

```shell
python3 -m venv venv
source venv/bin/activate
pip install -U pip
pip install -r requirements.txt 
```

## Run the backend service

Via Docker Compose (recommended):

```shell
# Run from repository root
docker-compose up api
```

Locally:

```shell
source venv/bin/activate
python3 manage.py migrate --noinput && \
python3 manage.py loaddata initial.json --app api --format json && \
python3 manage.py runserver
```

## Reset the backend's django database

```shell
# Run from repository root
docker-compose run --rm psql << EOF
DROP DATABASE django;
CREATE DATABASE django;
ALTER ROLE djangouser SET client_encoding TO 'utf8';
ALTER ROLE djangouser SET default_transaction_isolation TO 'read committed';
ALTER ROLE djangouser SET timezone TO 'UTC';
GRANT ALL PRIVILEGES ON DATABASE django TO djangouser;
GRANT USAGE ON SCHEMA public TO djangouser;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO djangouser;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO djangouser;
GRANT CONNECT ON DATABASE dashboard TO djangouser;
EOF
```
