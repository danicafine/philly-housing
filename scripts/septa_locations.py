import requests
import pandas as pd
import numpy as np
from geopy import Nominatim

## get septa location data
r = requests.get('http://www3.septa.org/hackathon/locations/get_locations.php?lon=-75.33299748&lat=40.11043326&radius=300');

if (r.status_code == 200):
    data = r.text;
else:
    sys.exit('No septa data available')

## parse and load
df = pd.read_json(r.text);

## align and rename columns
df = df.drop(columns=['distance', 'location_data']);
df = df.rename(index=str, columns={'location_id':'septa_id', 'location_lat':'latitude', 'location_lon':'longitude'})

## split data for tables
locs_xref = df[['septa_id','latitude', 'longitude']];
septa = df[['septa_id', 'location_name', 'location_type']];
locs = locs_xref[['latitude', 'longitude']];

## add columns for output tables
locs['street_address'] = "";
locs['city'] = "";
locs['state'] = "";
locs['zipcode'] = np.nan;

## fetch address data from lat and lon values
geolocator = Nominatim();
for i in range(locs.shape[0]):
    lat = locs.iloc[i]['latitude'];
    lon = locs.iloc[i]['longitude'];
    lat_lon = str(lat) + ', ' + str(lon);

    try:
        a_obj = geolocator.reverse(lat_lon);
    except:
        a_obj = geolocator.reverse(lat_lon);

    ## address components
    try:
        street_address = a_obj.raw['address']['house_number'] + ' ' + a_obj.raw['address']['road'];
    except:
        street_address = a_obj.address 
    zipcode = a_obj.raw['address']['postcode']
    city = a_obj.raw['address']['city']
    state = a_obj.raw['address']['state']

    ## insert into dataframe
    locs['street_address'].iloc[i] = street_address; 
    locs['zipcode'].iloc[i] = zipcode; 
    locs['city'].iloc[i] = city; 
    locs['state'].iloc[i] = state; 

## save to csv for later use
locs_xref.to_csv('../data/septa_loc_xref.csv', sep=',', header=True, index=False);  
septa.to_csv('../data/septa.csv', sep=',', header=True, index=False);  
locs.to_csv('../data/locations_septa.csv', sep=',', header=True, index=False); 
