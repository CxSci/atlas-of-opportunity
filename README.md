# Atlas of Opportunity

This project is part of a collaborative research initiative enabled by principal partner BankSA, MIT Connection Science, the South Australian Government and technical partners Optus and DSpark . This research is led by MIT Connection Science, its Adelaide bigdata Living Lab, and local research institutes including University of South Australia and The University of Adelaide.

The Living Lab works to better understand how social interaction and economic behavior impact future outcomes of communities across South Australia. This map showcases recent research revealing that understanding community movement patterns is crucial for understanding economic growth and mobility. Places with more diverse movement patterns are more likely to have higher near-future economic growth. The goal of the Atlas is to make these insights more accessible.

## Running the project

### Development

Locally via NPM

```sh
cd frontend
npm install
npm start

open http://localhost:3000/
```

Alternatively, via Docker Compose:

```sh
docker-compose up
open http://localhost:3000/
```

### Production

```sh
docker-compose -f docker-compose-prod.yml up
open http://localhost/
```
