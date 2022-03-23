\qecho Importing SA2_info_for_dashboard.csv...
CREATE TABLE IF NOT EXISTS SA2_info_for_dashboard (
    -- The first, third, and fourth columns are superfluous indexes and can be
    -- dropped after import.
    tmp_index text,
    SA2_code text not null,
    tmp_X text,
    tmp_X1 text,
    state_name text,
    state_code text,
    sa2_name16 text,
    persons_num numeric,
    median_persons_age numeric,
    males_num numeric,
    median_male_age numeric,
    females_num numeric,
    median_female_age numeric,
    percentage_person_aged_0_14 numeric,
    percentage_person_aged_15_64 numeric,
    percentage_person_aged_65_plus numeric,
    earners_persons numeric,
    median_age_of_earners_years numeric,
    gini_coefficient_no numeric,
    median_aud numeric,
    mean_aud numeric,
    income_aud numeric,
    highest_quartile_pc numeric,
    income_share_top_5pc numeric,
    third_quartile_pc numeric,
    lowest_quartile_pc numeric,
    income_share_top_1pc numeric,
    second_quartile_pc numeric,
    income_share_top_10pc numeric,
    popfraction numeric,
    quartile numeric,
    occup_diversity numeric,
    bsns_entries numeric,
    bsns_exits numeric,
    bsns_growth_rate numeric,
    bridge_diversity numeric,
    bridge_rank1 text,
    bridge_rank2 text,
    bridge_rank3 text,
    bridge_rank4 text,
    bridge_rank5 text,
    time_q1 numeric,
    time_q2 numeric,
    time_q3 numeric,
    time_q4 numeric,
    tot_time numeric,
    fq1 numeric,
    fq2 numeric,
    fq3 numeric,
    fq4 numeric,
    income_diversity numeric,
    raw_inequality numeric,
    inequality numeric,
    inflow_r1 text,
    inflow_r2 text,
    inflow_r3 text,
    outflow_r1 text,
    outflow_r2 text,
    outflow_r3 text,
    spent_r1 text,
    spent_r2 text,
    spent_r3 text,
    gain_r1 text,
    gain_r2 text,
    gain_r3 text,
    exchanged_r1 text,
    exchanged_r2 text,
    exchanged_r3 text
);

COPY sa2_info_for_dashboard
    FROM '/datasets/south_australia/sources/SA2_info_for_dashboard.csv'
    DELIMITER ','
    NULL 'NA'
    CSV
    HEADER;

ALTER TABLE SA2_info_for_dashboard
    DROP COLUMN tmp_index,
    DROP COLUMN tmp_X,
    DROP COLUMN tmp_X1
;





\qecho Importing abr_business_count_by_division.csv...
-- Start by treating everything as a string. Convert and cast them into
-- appropriate types after import.
CREATE TABLE IF NOT EXISTS abr_business_count_by_division (
    sa2_code text,
    industry_division_label text,
    industry_division_code text,
    sa2_name text,
    non_emp_2017 text,
    emp1_4_2017 text,
    emp5_19_2017 text,
    emp20_199_2017 text,
    emp200_2017 text,
    total_2017 text,
    non_emp_2018 text,
    emp1_4_2018 text,
    emp5_19_2018 text,
    emp20_199_2018 text,
    emp200_2018 text,
    total_2018 text,
    non_emp_2019 text,
    emp1_4_2019 text,
    emp5_19_2019 text,
    emp20_199_2019 text,
    emp200_2019 text,
    total_2019 text,
    predicted_total_2020 text
);

COPY abr_business_count_by_division
    FROM '/datasets/south_australia/sources/abr_business_count_by_division.csv'
    DELIMITER ','
    CSV
    HEADER;

-- abr_business_count_by_division.csv's numeric values are formatted strings
-- with commas. This removes the commas and casts them into numbers.
ALTER TABLE abr_business_count_by_division
    ALTER COLUMN non_emp_2017 TYPE numeric USING replace(non_emp_2017, ',', '')::numeric,
    ALTER COLUMN emp1_4_2017 TYPE numeric USING replace(emp1_4_2017, ',', '')::numeric,
    ALTER COLUMN emp5_19_2017 TYPE numeric USING replace(emp5_19_2017, ',', '')::numeric,
    ALTER COLUMN emp20_199_2017 TYPE numeric USING replace(emp20_199_2017, ',', '')::numeric,
    ALTER COLUMN emp200_2017 TYPE numeric USING replace(emp200_2017, ',', '')::numeric,
    ALTER COLUMN total_2017 TYPE numeric USING replace(total_2017, ',', '')::numeric,
    ALTER COLUMN non_emp_2018 TYPE numeric USING replace(non_emp_2018, ',', '')::numeric,
    ALTER COLUMN emp1_4_2018 TYPE numeric USING replace(emp1_4_2018, ',', '')::numeric,
    ALTER COLUMN emp5_19_2018 TYPE numeric USING replace(emp5_19_2018, ',', '')::numeric,
    ALTER COLUMN emp20_199_2018 TYPE numeric USING replace(emp20_199_2018, ',', '')::numeric,
    ALTER COLUMN emp200_2018 TYPE numeric USING replace(emp200_2018, ',', '')::numeric,
    ALTER COLUMN total_2018 TYPE numeric USING replace(total_2018, ',', '')::numeric,
    ALTER COLUMN non_emp_2019 TYPE numeric USING replace(non_emp_2019, ',', '')::numeric,
    ALTER COLUMN emp1_4_2019 TYPE numeric USING replace(emp1_4_2019, ',', '')::numeric,
    ALTER COLUMN emp5_19_2019 TYPE numeric USING replace(emp5_19_2019, ',', '')::numeric,
    ALTER COLUMN emp20_199_2019 TYPE numeric USING replace(emp20_199_2019, ',', '')::numeric,
    ALTER COLUMN emp200_2019 TYPE numeric USING replace(emp200_2019, ',', '')::numeric,
    ALTER COLUMN total_2019 TYPE numeric USING replace(total_2019, ',', '')::numeric,
    ALTER COLUMN predicted_total_2020 TYPE numeric USING replace(predicted_total_2020, ',', '')::numeric
;





\qecho Importing RENT_SA2_ANZSIC_output.csv...
CREATE TABLE IF NOT EXISTS RENT_SA2_ANZSIC_output (
    sa2_code_16 text,
    ANZSIC text,
    mean numeric,
    std numeric,
    count numeric
);

COPY RENT_SA2_ANZSIC_output
    FROM '/datasets/south_australia/sources/datalab_SA2_ANZSIC_output/RENT_SA2_ANZSIC_output.csv'
    DELIMITER ','
    CSV
    HEADER;

-- Drop the '.0' suffix sa2_code_16 and anzsic have from an incorrect cast to
-- floats.
UPDATE RENT_SA2_ANZSIC_output
    SET sa2_code_16 = replace(sa2_code_16, '.0', ''),
        anzsic = replace(anzsic, '.0', '')
;





\qecho Importing sa2_housing_prices_weekly_2021.csv...
-- Start by treating everything as a string. Convert and cast them into
-- appropriate types after import.
CREATE TABLE IF NOT EXISTS sa2_housing_prices_weekly_2021 (
    -- The first column is a superfluous index with an empty name and can be
    -- dropped after import.
    tmp_index text,
    sa2code text,
    median_1br_apt numeric,
    median_2br_apt numeric,
    median_3br_apt numeric,
    median_4above_apt numeric,
    median_1br_h numeric,
    median_2br_h numeric,
    median_3br_h numeric,
    median_4above_h numeric
);

COPY sa2_housing_prices_weekly_2021
    FROM '/datasets/south_australia/sources/sa2_housing_prices_weekly_2021.csv'
    DELIMITER ','
    NULL 'NA'
    CSV
    HEADER;

ALTER TABLE sa2_housing_prices_weekly_2021
    DROP COLUMN tmp_index
;





\qecho Importing SA2_output.csv...
CREATE TABLE IF NOT EXISTS SA2_output (
    sa2_code_16 text,
    mean_TOvsCOS numeric,
    std_TOvsCOS numeric,
    mean_rent numeric,
    std_rent numeric
);

COPY SA2_output
    FROM '/datasets/south_australia/sources/datalab_SA2_ANZSIC_output/SA2_output.csv'
    DELIMITER ','
    CSV
    HEADER;

-- Drop the '.0' suffix sa2_code_16 has from an incorrect cast to float.
UPDATE SA2_output
    SET sa2_code_16 = replace(sa2_code_16, '.0', '')
;




\qecho Importing sa2_population_and_projection.csv...
CREATE TABLE IF NOT EXISTS sa2_population_and_projection (
    SA2_MAIN16 text,
    sa2_name text,
    yr_2016 numeric,
    yr_2021 numeric,
    yr_2026 numeric,
    yr_2031 numeric,
    yr_2036 numeric
);

COPY sa2_population_and_projection
    FROM '/datasets/south_australia/sources/sa2_population_and_projection.csv'
    DELIMITER ','
    CSV
    HEADER;





\qecho Importing TOvsCOS_SA2_ANZSIC_output.csv...
CREATE TABLE IF NOT EXISTS TOvsCOS_SA2_ANZSIC_output (
    sa2_code_16 text,
    ANZSIC text,
    mean numeric,
    std numeric,
    count numeric
);

COPY TOvsCOS_SA2_ANZSIC_output
    FROM '/datasets/south_australia/sources/datalab_SA2_ANZSIC_output/TOvsCOS_SA2_ANZSIC_output.csv'
    DELIMITER ','
    CSV
    HEADER;

-- Drop the '.0' suffix sa2_code_16 and anzsic have from an incorrect cast to
-- floats.
UPDATE tovscos_sa2_anzsic_output
    SET sa2_code_16 = replace(sa2_code_16, '.0', ''),
        anzsic = replace(anzsic, '.0', '')
;





\qecho Importing transaction_indices.csv...
CREATE TABLE IF NOT EXISTS transaction_indices (
    -- The first column is a superfluous index with an empty name and can be
    -- dropped after import.
    tmp_index text,
    target_sa2 text,
    mcc text,
    avg_spent_index numeric,
    trx_count_index numeric
);

COPY transaction_indices
    FROM '/datasets/south_australia/sources/transaction_indices.csv'
    DELIMITER ','
    CSV
    HEADER;

ALTER TABLE transaction_indices
    DROP COLUMN tmp_index
;





\qecho Importing anzsic_codes_flattened.csv...
CREATE TABLE IF NOT EXISTS anzsic_codes_flattened (
    type text,
    title text,
    code text
);

COPY anzsic_codes_flattened
    FROM '/datasets/south_australia/sources/anzsic_codes_flattened.csv'
    DELIMITER ','
    CSV
    HEADER;
