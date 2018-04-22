select
	zipcode,
	count(cx.crime_id) as crime_ct
from mysql450.crime_location_xref cx
left outer join ( 
	select substr(zipcode, 1,5) as zipcode, avg(latitude) as latitude, avg(longitude) as longitude 
	from mysql450.locations
	where zipcode <> 0
	group by substr(zipcode, 1,5) ) l 
on
	 abs(l.latitude - cx.latitude) <= 0.01 and
     abs(l.longitude - cx.longitude) <= 0.01
where zipcode is not null
group by zipcode
order by crime_ct asc
