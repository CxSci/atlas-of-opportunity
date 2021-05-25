#!/bin/bash
#pqsl "\copy sadata FROM '/data/SA2_info_for_dashboard.csv' with DELIMITER ',' CSV HEADER"

chmod +x /data/init_database.py
python3 /data/init_database.py

#psql "\copy sa2data FROM '/data/SA2_SA2s.csv' with DELIMITER ',' CSV HEADER"