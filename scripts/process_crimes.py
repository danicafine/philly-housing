import pandas as pd
from geopy.geocoders import Nominatim
import numpy as np;
import sys

data = pd.read_csv('../data/crimes_cleansed.csv');
data = data.loc[data['date'] >= 20170123] # select one years' worth of data

## separate data by eventual tables
locs_xref = data[['crime_id','longitude','latitude']];
crimes = data[['crime_id','date','description']];
locs = locs_xref[['longitude','latitude']]
locs = locs.drop_duplicates()

## add columns for output tables
locs['street_address'] = "";
locs['city'] = "";
locs['state'] = "";
locs['zipcode'] = np.nan;

## fetch address data from lat and lon values
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

## save to csv for later use
locs_xref.to_csv('../data/crime_loc_xref.csv', sep=',', header=True, index=False);
crimes.to_csv('../data/crimes.csv', sep=',', header=True, index=False);
locs.to_csv('../data/locations_crimes.csv', sep=',', header=True, index=False);
