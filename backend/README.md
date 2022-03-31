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
export DEBUG=True
python3 manage.py migrate --noinput && \
python3 manage.py loaddata initial.json --app api --format json && \
python3 manage.py runserver
```

## Reset the backend's django database

Via Docker Compose (recommended):

TODO: Include docker-compose instructions here.

Locally:

```shell
source venv/bin/activate
export DEBUG=True
python3 manage.py flush --noinput && \
python3 manage.py migrate --noinput && \
python3 manage.py loaddata initial.json --app api --format json
```
