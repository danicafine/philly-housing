import pandas as pd
from geopy.geocoders import Nominatim
import numpy as np;
import sys

data = pd.read_csv('../data/housing_assessments_cleansed.csv');
data = data.loc[(data['assessment_date'] >= 20170123) | (data['sale_date'] >= 20170123)] # select one years' worth of data

## separate data by eventual tables
locs_xref = data[['property_id','longitude','latitude']];
assessed_on = data[['property_id', 'assessment_date', 
                    'market_value']];
sold_on = data[['property_id', 'sale_date', 'sale_price']]
properties = data[['property_id','building_description', 
                   'category_description','fireplaces', 
                   'garage_spaces', 'bathroom_ct', 'bedroom_ct',
                   'room_ct', 'story_ct', 'livable_area', 
                   'unit', 'year_built', 'year_built_estimate']];
locs = locs_xref[['longitude','latitude']]
locs = locs.drop_duplicates()

## add columns for output tables
locs['street_address'] = "";
locs['city'] = "";
locs['state'] = "";
locs['zipcode'] = np.nan;

## fetch address data from lat and lon values
'''
geolocator = Nominatim();
for i in range(locs.shape[0]):
    print i
    lat = locs.iloc[i]['latitude'];
    lon = locs.iloc[i]['longitude'];
    lat_lon = str(lat) + ', ' + str(lon);

    try:
        a_obj = geolocator.reverse(lat_lon, timeout=10);
    except:
        a_obj = geolocator.reverse(lat_lon, timeout=10);
    
    ## address components
    try:
        street_address = a_obj.raw['address']['building']
    except KeyError:
        try:
            street_address = a_obj.raw['address']['house_number'] + ' ' + a_obj.raw['address']['road']  
        except KeyError:
            street_address = a_obj.address
    zipcode = a_obj.raw['address']['postcode']
    city = a_obj.raw['address']['city']
    state = a_obj.raw['address']['state']

    ## insert into dataframe
    locs['street_address'].iloc[i] = street_address;
    locs['city'].iloc[i] = city;
    locs['state'].iloc[i] = state;
    locs['zipcode'].iloc[i] = zipcode;
'''

## save to csv for later use
locs_xref.to_csv('../data/property_loc_xref.csv', sep=',', header=True, index=False);
properties.to_csv('../data/properties.csv', sep=',', header=True, index=False);
assessed_on.to_csv('../data/property_assessed_on.csv', sep=',', header=True, index=False);
sold_on.to_csv('../data/property_sold_on.csv', sep=',', header=True, index=False);
locs.to_csv('../data/locations_properties.csv', sep=',', header=True, index=False);
