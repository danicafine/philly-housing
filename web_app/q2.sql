select
         s.location_name,
         s.location_type
     from property_location_xref px
     cross
     join locations l
     join septa_location_xref sx on
          sx.latitude = l.latitude and
          sx.longitude = l.longitude
     join septa_locations s on
          sx.septa_id = s.septa_id
     where px.property_id = $PROPERTY_ID -- SELECT FOR A GIVEN PROPERTY
       and abs(l.latitude - px.latitude) <= $DIST
       and abs(l.longitude - px.longitude) <= $DIST