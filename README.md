# Atlas of Opportunity

This project is part of a collaborative research initiative enabled by principal partner BankSA, MIT Connection Science, the South Australian Government and technical partners Optus and DSpark . This research is led by MIT Connection Science, its Adelaide bigdata Living Lab, and local research institutes including University of South Australia and The University of Adelaide.

The Living Lab works to better understand how social interaction and economic behavior impact future outcomes of communities across South Australia. This map showcases recent research revealing that understanding community movement patterns is crucial for understanding economic growth and mobility. Places with more diverse movement patterns are more likely to have higher near-future economic growth. The goal of the Atlas is to make these insights more accessible.

## Setting up the project

The Atlas is made up of a ReactJS frontend app, a Django backend api, and a PostGIS database.

Some of the data files required to run the South Australia dataset are not included in this repo and must be downloaded separately. Instructions can be found in [data/datasets/south_australia](https://github.com/CxSci/SA-dashboard/tree/backend-api/data/datasets/south_australia).

## Running the project

The recommended way to run the Atlas is via Docker Compose. For instructions on how to run each service locally, see their respective README files.

### Development

Docker Compose (recommended):

```sh
docker-compose up
open http://localhost:3000/
```

Run just the frontend locally:

```sh
docker-compose up -d postgis postprocessor api
cd frontend
npm install
npm start

open http://localhost:3000/
```

### Production

```sh
docker-compose -f docker-compose-prod.yml up
open http://localhost/
```
