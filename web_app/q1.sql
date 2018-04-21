USE mysql450;
select
         substr(l.zipcode, 1, 5) as zipcode,
         avg(pa.market_value) as avg_market_value,
         avg(ps.sale_price) as avg_sale_price
     from property_sold ps
     join property_assessed pa on
          pa.property_id = ps.property_id
     join property_location_xref px on
          ps.property_id = px.property_id
     join locations l on
          l.latitude = px.latitude and
          l.longitude = px.longitude
     group by substr(l.zipcode, 1, 5);