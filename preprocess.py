'''
    Script to read in minute-level bitcoin data, consolidate 
    data points into daily values, and save into .dat files.

    Danica Fine
'''

import numpy as np
import datetime as dt
import holidays
from pandas import DataFrame

# define US holidays for later removal
holidays = holidays.UnitedStates() 

# define files to parse
loc = '../Data/'
files = [ 'bitstampUSD_1-min_data_2012-01-01_to_2017-10-20.csv',
          'btceUSD_1-min_data_2012-01-01_to_2017-05-31.csv',
          'btcnCNY_1-min_data_2012-01-01_to_2017-05-31.csv',
          'coinbaseUSD_1-min_data_2014-12-01_to_2017-10-20.csv',
          'coincheckJPY_1-min_data_2014-10-31_to_2017-10-20.csv',
          'krakenEUR_1-min_data_2014-01-08_to_2017-05-31.csv',
          'krakenUSD_1-min_data_2014-01-07_to_2017-05-31.csv' ]

# load data
for x in range(len(files)):
    # parse all columns into floats, skip header
    data = np.loadtxt(loc + files[x], delimiter=',', dtype='float32', skiprows=1)
    
    data_tmp = np.empty((data.shape[0], data.shape[1]))
    # iterate over input fields and cleanse
    # consolidate minute-by-minute data into days
    for i in range(data.shape[0]):
        data_tmp[i] = data[i]

        curr_dt = dt.datetime.utcfromtimestamp(int(data[i, 0]))
        if (curr_dt in holidays or curr_dt.weekday() >= 5):
            # if holiday or weekend, mark as nan
            data_tmp[i] = np.nan
        else:
            # set datetime to date
            data_tmp[i,0] = int(curr_dt.date().strftime("%Y%m%d"))

    # remove rows with nan since they're useless to us
    output = data_tmp[~np.isnan(data_tmp).any(axis=1)]

    # save basic, cleansed data, just in case.
    np.savetxt(loc + files[x].replace('.csv', '_cleansed.dat'), output, fmt='%.4f',  delimiter=',')

    # use pandas to group by dates and select max/min values.
    cols = ['Date', 'Open', 'High', 'Low', 'Close', 'Volume_(BTC)', 'Volume_(Currency)', 'Weighted_Price'];
    mf = DataFrame(output, columns=cols)
    mf['Date'] = mf['Date'].astype(int).map(str)

    # grabs the first set of basic aggregates from the initial dataframe
    aggs = mf.groupby('Date', as_index=False).agg({'Open':'first','High':'max', 'Low':'min', 'Close':'last', 
                                                   'Volume_(BTC)':'mean','Volume_(Currency)':'mean', 
                                                   'Weighted_Price':'mean'})

    aggs.to_csv(path_or_buf=loc + files[x].replace('.csv', '_agg.dat'), 
                sep=',', columns=cols, header=True, index=False)
