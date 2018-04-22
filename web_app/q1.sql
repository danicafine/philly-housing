USE mysql450;
select
         l.zipcode,
         count(cx.crime_id) as crime_ct
     from crime_location_xref cx
     join locations l on
          l.latitude = cx.latitude and
          l.longitude = cx.longitude
     group by l.zipcode
     order by crime_ct asc