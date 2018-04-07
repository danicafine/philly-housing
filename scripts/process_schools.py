import pandas as pd
from geopy.geocoders import Nominatim
import numpy as np;

data = pd.read_csv('../data/schools_cleansed.csv');

## separate data by eventual tables
locs_xref = data[['school_id','longitude','latitude']];
schools = data[['school_id','facility_name','facility_telephone','grade_level','grade_range','size','type','subtype']];
locs = locs_xref[['longitude','latitude']]

## add columns for output tables
locs['street_address'] = "";
locs['city'] = "";
locs['state'] = "";
locs['zipcode'] = np.nan;

## fetch address data from lat and lon values
geolocator = Nominatim();
count =0;
for i in range(locs.shape[0]):
    lat = locs_xref.iloc[i]['latitude'];
    lon = locs_xref.iloc[i]['longitude'];
    lat_lon = str(lat) + ', ' + str(lon);

    try:
        a_obj = geolocator.reverse(lat_lon);
    except:
        a_obj = geolocator.reverse(lat_lon);
    
    ## address components
    try:
        street_address = a_obj.raw['address']['school']
    except KeyError:
        try:
            street_address = a_obj.raw['address']['library']
        except KeyError:
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
locs_xref.to_csv('../data/school_loc_xref.csv', sep=',', header=True, index=False);
schools.to_csv('../data/schools.csv', sep=',', header=True, index=False);
locs.to_csv('../data/locations_schools.csv', sep=',', header=True, index=False);
