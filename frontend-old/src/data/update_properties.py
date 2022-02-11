import json
import sys

import numpy as np
import pandas as pd
from tqdm import tqdm

"""
Update a GeoJSON file's features with properties from a CSV.

Usage:
  cat original.geojson | python update_properties.py \
    data.csv > updated.geojson
"""


COLUMNS_TO_COERCE = [
    'bridge_rank1',
    'bridge_rank2',
    'bridge_rank3',
    'bridge_rank4',
    'bridge_rank5',
    'inflow_r1',
    'inflow_r2',
    'inflow_r3',
    'outflow_r1',
    'outflow_r2',
    'outflow_r3',
    'spent_r1',
    'spent_r2',
    'spent_r3',
    'gain_r1',
    'gain_r2',
    'gain_r3',
    'exchanged_r1',
    'exchanged_r2',
    'exchanged_r3',
]

DESIRED_COLUMNS = [
    'SA2_code',
    'persons_num',
    'median_persons_age',
    'males_num',
    'median_male_age',
    'females_num',
    'median_female_age',
    'percentage_person_aged_0_14',
    'percentage_person_aged_15_64',
    'percentage_person_aged_65_plus',
    'earners_persons',
    'median_age_of_earners_years',
    'gini_coefficient_no',
    'median_aud',
    'mean_aud',
    'income_aud',
    'highest_quartile_pc',
    'income_share_top_5pc',
    'third_quartile_pc',
    'lowest_quartile_pc',
    'income_share_top_1pc',
    'second_quartile_pc',
    'income_share_top_10pc',
    'popfraction',
    'quartile',
    'occup_diversity',
    'bsns_entries',
    'bsns_exits',
    'bsns_growth_rate',
    'bridge_diversity',
    'bridge_rank1',
    'bridge_rank2',
    'bridge_rank3',
    'bridge_rank4',
    'bridge_rank5',
    'time_q1',
    'time_q2',
    'time_q3',
    'time_q4',
    'tot_time',
    'fq1',
    'fq2',
    'fq3',
    'fq4',
    'income_diversity',
    'raw_inequality',
    'inequality',
    'inflow_r1',
    'inflow_r2',
    'inflow_r3',
    'outflow_r1',
    'outflow_r2',
    'outflow_r3',
    'spent_r1',
    'spent_r2',
    'spent_r3',
    'gain_r1',
    'gain_r2',
    'gain_r3',
    'exchanged_r1',
    'exchanged_r2',
    'exchanged_r3',
]


def main():
    try:
        # Force specific columns to be integers instead of floats.
        # Saves a few thousand bytes on bridge properties.
        dtypes = {k: 'Int64' for k in COLUMNS_TO_COERCE}
        df = pd.read_csv(sys.argv[1], usecols=DESIRED_COLUMNS, dtype=dtypes)
        # Rename SA2_code from CSV to match SA2_MAIN16 in GeoJSON to avoid
        # adding duplicate data when records are merged.
        df.rename({'SA2_code': 'SA2_MAIN16'}, axis='columns', inplace=True)

        geojson = json.load(sys.stdin)

    except IndexError:
        print("Missing input.", file=sys.stderr)
        return False

    for feature in tqdm(geojson['features']):
        sa2_id = feature['properties']['SA2_MAIN16']
        # Find SA2's entry in csv, converting NaNs to nulls
        records = df.loc[df.SA2_MAIN16 == int(sa2_id)].replace({np.nan: None})
        # Extract values we care about
        try:
            values = records.to_dict('records')[0]
        except IndexError:
            print(f"Warning: missing data for "
                  f"{feature['properties']['SA2_MAIN16']} : "
                  f"{feature['properties']['SA2_NAME16']}",
                  file=sys.stderr)
            values = {k: 'Missing data' for k in DESIRED_COLUMNS}
        # Add them to the geojson object
        feature['properties'].update(values)

    def np_encoder(object):
        if isinstance(object, np.generic):
            return object.item()

    # Write out an updated geojson file
    json.dump(geojson, sys.stdout, ensure_ascii=False, default=np_encoder)


if __name__ == "__main__":
    sys.exit(not main())
