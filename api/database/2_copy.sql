
IF(NOT EXISTS(SELECT 1 FROM SADatabase.sadata))    --only add data if sadata database is empty
BEGIN
    \copy sadata FROM '/data/SA2_info_for_dashboard.csv' with DELIMITER ',' CSV HEADER
END
