import geopandas as gpd
import numpy as np
import pandas as pd
from scipy.stats import entropy
from sklearn.metrics.pairwise import haversine_distances
from sqlalchemy import create_engine
import sys


"""
The method we use for accessiblity calculation divides CBGs into two: demand
and supplier CBGs. We can think of demand CBGs as areas where our target
residents live and suppliers as where POIs are located. In this setting,
Rochester CBGs are our demand CBGs and the whole greater Rochester Area is our
supplier. So, Rochester CBGs are both demand and supplier CBGs.

To calculate accessibility scores, we need lat/lng of both demand and supplier
CBGs to get the distance matrix between each location. Next, we pass the
resulting matrix into function `comp_accessibility_score` along side poi counts
in each supplier and population of each demand CBG. The resulting value is a
pd.Series in which indices consist of demand CBGs and values are accessibility
scores.

In this script, an example run is displayed. In addition, we add hypothetical
POIs, for which users only enter their home CBGs, and see how they affect
overall accessibility distribution.
"""


POI_CODE_TO_TITLE = {
    'gen': 'General',
    'other_amusement_and_recreation': 'Other Amusement and Recreation Industries',
    'svcs_to_buildings_and_dwellings': 'Services to Buildings and Dwellings',
    'personal_care_svcs': 'Personal Care Services',
    'traveler_accommodation': 'Traveler Accommodation',
    'gasoline_stations': 'Gasoline Stations',
    'other_professional_scientific_and_technical_svcs': 'Other Professional, Scientific, and Technical Services',
    'restaurants_and_other_eating_places': 'Restaurants and Other Eating Places',
    'chemical_and_allied_products_merchant_wholesalers': 'Chemical and Allied Products Merchant Wholesalers',
    'clothing_stores': 'Clothing Stores',
    'beverage_manufacturing': 'Beverage Manufacturing',
    'office_supplies_stationery_and_gift_stores': 'Office Supplies, Stationery, and Gift Stores',
    'grocery_stores': 'Grocery Stores',
    'furniture_stores': 'Furniture Stores',
    'specialty_food_stores': 'Specialty Food Stores',
    'automobile_dealers': 'Automobile Dealers',
    'depository_credit_intermediation': 'Depository Credit Intermediation',
    'beer_wine_and_liquor_stores': 'Beer, Wine, and Liquor Stores',
    'automotive_repair_and_mntn': 'Automotive Repair and Maintenance',
    'offices_of_physicians': 'Offices of Physicians',
    'jewelry_luggage_and_leather_goods_stores': 'Jewelry, Luggage, and Leather Goods Stores',
    'accounting_tax_pre_bookkeeping_and_payroll_svcs': 'Accounting, Tax Preparation, Bookkeeping, and Payroll Services',
    'health_and_personal_care_stores': 'Health and Personal Care Stores',
    'agencies_brokerages_and_other_insurance_related': 'Agencies, Brokerages, and Other Insurance Related Activities',
    'home_furnishings_stores': 'Home Furnishings Stores',
    'support_activities_for_road_transportation': 'Support Activities for Road Transportation',
    'sporting_goods_hobby_and_musical_instrument_stores': 'Sporting Goods, Hobby, and Musical Instrument Stores',
    'bakeries_and_tortilla_manufacturing': 'Bakeries and Tortilla Manufacturing',
    'shoe_stores': 'Shoe Stores',
    'automotive_parts_accessories_and_tire_stores': 'Automotive Parts, Accessories, and Tire Stores',
    'lessors_of_real_estate': 'Lessors of Real Estate',
    'other_ambulatory_health_care_svcs': 'Other Ambulatory Health Care Services',
    'couriers_and_express_delivery_svcs': 'Couriers and Express Delivery Services',
    'department_stores': 'Department Stores',
    'other_personal_svcs': 'Other Personal Services',
    'wired_and_wireless_telecommunications_carriers': 'Wired and Wireless Telecommunications Carriers',
    'colleges_universities_and_professional_schools': 'Colleges, Universities, and Professional Schools',
    'offices_of_dentists': 'Offices of Dentists',
    'offices_of_other_health_practitioners': 'Offices of Other Health Practitioners',
    'offices_of_real_estate_agents_and_brokers': 'Offices of Real Estate Agents and Brokers',
    'drycleaning_and_laundry_svcs': 'Drycleaning and Laundry Services',
    'building_material_and_supplies_dealers': 'Building Material and Supplies Dealers',
    'elementary_and_secondary_schools': 'Elementary and Secondary Schools',
    'museums_historical_sites_and_similar_institutions': 'Museums, Historical Sites, and Similar Institutions',
    'electric_power_gen_transmission_and_distribution': 'Electric Power Generation, Transmission and Distribution',
    'other_miscellaneous_store_retailers': 'Other Miscellaneous Store Retailers',
    'florists': 'Florists',
    'other_information_svcs': 'Other Information Services',
    'motion_picture_and_video': 'Motion Picture and Video Industries',
    'electronics_and_appliance_stores': 'Electronics and Appliance Stores',
    'drinking_places_alcoholic_beverages': 'Drinking Places (Alcoholic Beverages)',
    'nan': 'nan',
    'religious_organizations': 'Religious Organizations',
    'child_day_care_svcs': 'Child Day Care Services',
    'other_financial_investment_activities': 'Other Financial Investment Activities',
    'other_schools_and_instruction': 'Other Schools and Instruction',
    'home_health_care_svcs': 'Home Health Care Services',
    'book_stores_and_news_dealers': 'Book Stores and News Dealers',
    'other_motor_vehicle_dealers': 'Other Motor Vehicle Dealers',
    'used_merch_stores': 'Used Merchandise Stores',
    'personal_and_household_goods_repair_and_mntn': 'Personal and Household Goods Repair and Maintenance',
    'continuing_care_rtrmnt_comm_and_asst_living_fac': 'Continuing Care Retirement Communities and Assisted Living Facilities for the Elderly',
    'medical_and_diagnostic_laboratories': 'Medical and Diagnostic Laboratories',
    'outpatient_care_centers': 'Outpatient Care Centers',
    'justice_public_order_and_safety_activities': 'Justice, Public Order, and Safety Activities',
    'gen_merch_stores_incl_warehouse_clubs_superctrs': 'General Merchandise Stores, including Warehouse Clubs and Supercenters',
    'individual_and_family_svcs': 'Individual and Family Services',
    'automotive_equipment_rental_and_leasing': 'Automotive Equipment Rental and Leasing',
    'warehousing_and_storage': 'Warehousing and Storage',
    'employment_svcs': 'Employment Services',
    'consumer_goods_rental': 'Consumer Goods Rental',
    'executive_legislative_and_other_gen_govt_support': 'Executive, Legislative, and Other General Government Support',
    'gambling': 'Gambling Industries',
    'other_transit_and_ground_passenger_transportation': 'Other Transit and Ground Passenger Transportation',
    'technical_and_trade_schools': 'Technical and Trade Schools',
    'gen_medical_and_surgical_hospitals': 'General Medical and Surgical Hospitals',
    'hardware_plumb_heat_equip_supplies_merch_wholesale': 'Hardware, and Plumbing and Heating Equipment and Supplies Merchant Wholesalers',
    'building_equipment_contractors': 'Building Equipment Contractors',
    'death_care_svcs': 'Death Care Services',
    'waste_treatment_and_disposal': 'Waste Treatment and Disposal',
    'administration_of_economic_programs': 'Administration of Economic Programs',
    'steel_product_manufacturing_from_purchased_steel': 'Steel Product Manufacturing from Purchased Steel',
    'drugs_and_druggists_sundries_merchant_wholesalers': "Drugs and Druggists' Sundries Merchant Wholesalers", 'gen_rental_centers': 'General Rental Centers',
    'amusement_parks_and_arcades': 'Amusement Parks and Arcades',
    'commercial_industrial_machine_equip_rental_leasing': 'Commercial and Industrial Machinery and Equipment Rental and Leasing',
    'household_appl_elec_elec_gds_merch_wholesalers': 'Household Appliances and Electrical and Electronic Goods Merchant Wholesalers',
    'printing_and_related_support_activities': 'Printing and Related Support Activities',
    'postal_service': 'Postal Service',
    'other_leather_and_allied_product_manufacturing': 'Other Leather and Allied Product Manufacturing',
    'grantmaking_and_giving_svcs': 'Grantmaking and Giving Services',
    'machinery_equipment_and_supplies_merch_wholesalers': 'Machinery, Equipment, and Supplies Merchant Wholesalers',
    'support_activities_for_air_transportation': 'Support Activities for Air Transportation',
    'specialized_freight_trucking': 'Specialized Freight Trucking',
    'electronic_and_precision_equipment_repair_and_mntn': 'Electronic and Precision Equipment Repair and Maintenance',
    'lumber_and_other_const_materials_merch_wholesalers': 'Lumber and Other Construction Materials Merchant Wholesalers',
    'rail_transportation': 'Rail Transportation',
    'miscellaneous_durable_goods_merchant_wholesalers': 'Miscellaneous Durable Goods Merchant Wholesalers',
    'lawn_and_garden_equipment_and_supplies_stores': 'Lawn and Garden Equipment and Supplies Stores',
    'nondepository_credit_intermediation': 'Nondepository Credit Intermediation',
    'interurban_and_rural_bus_transportation': 'Interurban and Rural Bus Transportation',
    'investigation_and_security_svcs': 'Investigation and Security Services',
    'spectator_sports': 'Spectator Sports',
    'coating_engraving_heat_treating_and_allied_acts': 'Coating, Engraving, Heat Treating, and Allied Activities',
    'rv_recreational_vehicle_parks_and_camps': 'RV (Recreational Vehicle) Parks and Recreational Camps',
    'grocery_and_related_product_merchant_wholesalers': 'Grocery and Related Product Merchant Wholesalers',
    'junior_colleges': 'Junior Colleges',
    'other_miscellaneous_manufacturing': 'Other Miscellaneous Manufacturing',
    'direct_selling_establishments': 'Direct Selling Establishments',
    'community_food_housing_emergency_other_relief_svcs': 'Community Food and Housing, and Emergency and Other Relief Services',
    'promoters_of_performing_arts_sports_and_sim_events': 'Promoters of Performing Arts, Sports, and Similar Events',
    'nursing_care_fac_skilled_nursing_fac': 'Nursing Care Facilities (Skilled Nursing Facilities)',
    'activities_related_to_credit_intermediation': 'Activities Related to Credit Intermediation',
    'motor_vehicle_manufacturing': 'Motor Vehicle Manufacturing',
    'urban_transit_systems': 'Urban Transit Systems',
    'financial_all': 'Financial Services',
    'mtb_atms': 'M&T ATMs',
    'mtb_branches': 'M&T Branches'
}



def comp_dist_mat(x, y, row_index, col_index):
    """
    Construct distance matrix for the given locations.

    Parameters
    ----------
    x : np.array of [[lat, lng]]
    y : np.array of [[lat, lng]]
    row_index : list, np.array
        Names to be used for the indices of resulting distance matrix.
    col_index : list, np.array
        Names to be used for the columns of resulting distance matrix.

    Returns
    -------
    pd.DataFrame
        Resulting distance matrix as a dataframe.
    """
    return pd.DataFrame(
        haversine_distances(np.radians(x), np.radians(y)) * 6371,
        index=row_index, columns=col_index)


def get_poi_counts(cbg_pois, cbgs, selected_poi_cat=None):
    """
    Calculate count of point of interests (POI) in the given census block
    groups (CBG).

    Parameters
    ----------
    cbg_pois : pd.DataFrame
        Dataframe that contains POIs and their categories.
    cbgs : pd.DataFrame
        Dataframe that stores cbgs
    selected_poi_cat : list of str, default None, no filtering is done

    Returns
    -------
    pd.DataFrame
        Resulting dataframe in which poi count values are stored
        in columns while cbgs are indices.
    """
    if not selected_poi_cat:
        filtered_pois = cbg_pois
    else:
        filtered_pois = cbg_pois[cbg_pois['top_category'].isin(
            [selected_poi_cat])]
    cbg_ind = filtered_pois.geoid.astype(str)

    # number of pois in each cbg
    counts = [(cbg_ind == x).sum() for x in cbgs.geoid.values]

    return pd.DataFrame({'count': counts}, index=cbgs.geoid.values)


def comp_accessibility_score(cbg_dist_mat, cbg_poi_counts, cbg_pop,
                             beta=-1, name='scores'):
    """
    Compute amenity/point of interest (POI) accessibility scores.

    Parameters
    ----------
    cbg_dist_mat : pd.DataFrame
        Distance matrix between demand and supply CBG.
    cbg_poi_counts : pd.Series
        Point of interest count in each CBG.
    cbg_pop : pd.Series
        Population of each CBG.
    beta : int, default -1
        Exponent of the distance decay function.
    name : str, default 'scores'
        Index name for the returned series object.

    Returns
    -------
    pd.Series
        A series object storing the final scores with CBGs as indices.
    """
    # distance decay on the distance matrix
    dmat = (cbg_dist_mat + 1e-10) ** beta
    # calculate denominator - D_k * f(d_kj)
    denom = dmat.mul(cbg_pop + 1e-10, axis=0).sum(axis=0)
    # and the numerator - S_j * f(ij)
    numerator = dmat.mul(cbg_poi_counts, axis=1)
    # get the scores
    scores = numerator.div(denom, axis=1).sum(axis=1)

    return scores.rename(name)


def accessibility_score_for_poi_type(
        greater_city_pois, supplier_cbgs, score_type, cbg_dist_mat, cbg_pop):
    # Turn the snake_case column name into one of Safegraph's "top_category"
    # values. Default to "gen" and "General".
    score_title = POI_CODE_TO_TITLE.get(score_type, "General")
    if score_title == "General":
        score_title = None

    # get poi count for specified poi categories
    # TODO: replace this function with a faster SQL query using `group by`
    #       and `count()`
    supplier_poi_counts = get_poi_counts(
        greater_city_pois, supplier_cbgs, selected_poi_cat=score_title)
    supplier_poi_counts = supplier_poi_counts['count']

    # here we obtain the final accessibility scores
    acc_scores = comp_accessibility_score(
        cbg_dist_mat, supplier_poi_counts, cbg_pop, name=f'{score_type}_acc')
    scores_df = pd.DataFrame()
    scores_df[f'{score_type}_acc'] = acc_scores

    # Rank scores to ease visualization
    scores_df[f'{score_type}_acc_rank'] = acc_scores.rank(pct=True)
    return scores_df


def load_data(engine):
    # get population data
    cbg_population = pd.read_sql_query("""
        select geoid, total_population from usa_ny_rochester.demographics
        """, engine)

    # Greater Rochester CBGS
    # Define "Greater Rochester" as all of Munroe county (countyfp == '055')

    greater_city_cbg_shp = gpd.read_postgis("""
        select geoid, ST_Centroid(geom) as centroid
        from usa_ny_rochester.tl_2019_36_bg
        where countyfp = '055'
        """, engine, geom_col="centroid")
    # Rochester CBGs
    # Define Rochester CBGs as all CBGs in Munroe County with at least 25%
    # overlap of the City of Rochester's geometry. Assumes low but non-zero
    # overlap is due to geometry precious errors.
    city_main_cbgs = pd.read_sql_query("""
        with city as (
            select geom
            from usa_ny_rochester.tl_2019_36_place
            where geoid = '3663000' -- Rochester city
        )
        select geoid
        from usa_ny_rochester.tl_2019_36_bg as county
        inner join city on ST_Intersects(county.geom, city.geom)
        where countyfp = '055'
            and ROUND((100 * (ST_Area(
                ST_Intersection(county.geom, city.geom))) /
                ST_Area(county.geom))::NUMERIC,0) > 25
        """, engine)
    # POIs in Greater Rochester Area
    greater_city_pois = pd.read_sql_query("""
        with cbgs as (
            select geoid
            from usa_ny_rochester.tl_2019_36_bg
            where countyfp = '055'
        )
        select geoid, top_category
        from usa_ny_rochester.safegraph_pois as pois
        inner join cbgs on cbgs.geoid = pois."GEOID"::TEXT
        """, engine)

    return (cbg_population, greater_city_cbg_shp, city_main_cbgs, greater_city_pois,)


def normalized_poi_accessibility_score(dsn, score_type=None, poi_type=None, cbg_geoid=None, num_new_pois=0):
    engine = create_engine(dsn)
    (cbg_population, greater_city_cbg_shp,
        city_main_cbgs, greater_city_pois,) = load_data(engine)
    engine.dispose()

    # Add entries for any hypothetical POIs
    if num_new_pois and num_new_pois > 0:
        entries = []
        for n in range(num_new_pois):
            entries.append({
                # Turn the snake_case column name into one of Safegraph's
                # "top_category" values. Default to "gen" and "General".
                'top_category': POI_CODE_TO_TITLE.get(poi_type, "General"),
                'geoid': cbg_geoid
            })
        greater_city_pois = pd.concat(
            [greater_city_pois, pd.DataFrame(entries)], axis=0)

    # just renaming into new variables
    demand_cbgs = greater_city_cbg_shp[
        greater_city_cbg_shp.geoid.isin(city_main_cbgs.geoid)]
    supplier_cbgs = greater_city_cbg_shp

    # we get lat/lng of each CBGs' centroid
    demand_cbg_locs = np.array(list(zip(
        demand_cbgs['centroid'].y, demand_cbgs['centroid'].x)))
    supplier_cbg_locs = np.array(list(zip(
        supplier_cbgs['centroid'].y, supplier_cbgs['centroid'].x)))

    # and calculate the distance matrix
    cbg_dist_mat = comp_dist_mat(demand_cbg_locs, supplier_cbg_locs,
                                 demand_cbgs.geoid.values,
                                 supplier_cbgs.geoid.values)

    # we get population records for demand (Rochester) CBGs
    cbg_pop = cbg_population.set_index('geoid')['total_population']
    cbg_pop = cbg_pop[demand_cbgs.geoid.values]

    scores_df = accessibility_score_for_poi_type(
        greater_city_pois, supplier_cbgs, score_type, cbg_dist_mat, cbg_pop)

    # Strip down to just geoid and normalized rank, then rename those columns
    # to what the Atlas API is expected to return, `id` and `data`.
    scores_df = scores_df.filter(regex='_acc_rank')
    scores_df.reset_index(inplace=True)
    scores_df.rename(columns={
        "index": "id",
        next(s for s in scores_df.columns if s.endswith("_acc_rank")): "data"},
        inplace=True)

    return scores_df.to_dict("records")
