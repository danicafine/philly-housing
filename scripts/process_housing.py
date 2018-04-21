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
properties = data[['property_id','building_description', 'category_description','fireplaces', 
                   'garage_spaces', 'bathroom_ct', 'bedroom_ct','room_ct', 'story_ct', 
                   'livable_area', 'year_built']];
locs = data[['longitude','latitude','street_address','city','state','zipcode']]
locs = locs.drop_duplicates()

## save to csv for later use
locs_xref.to_csv('../data/property_loc_xref.csv', sep=',', header=True, index=False);
properties.to_csv('../data/properties.csv', sep=',', header=True, index=False);
assessed_on.to_csv('../data/property_assessed_on.csv', sep=',', header=True, index=False);
sold_on.to_csv('../data/property_sold_on.csv', sep=',', header=True, index=False);
locs.to_csv('../data/locations_properties.csv', sep=',', header=True, index=False);
