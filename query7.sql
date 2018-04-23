select e.zipcode, ((l.crime_ct - e.crime_ct) / e.crime_ct) as prcnt_change
from
(
	select zipcode, count(cx.crime_id) as crime_ct
	from mysql450.crime_location_xref cx
	join crimes c on cx.crime_id = c.crime_id
	left outer join ( 
		select substr(zipcode, 1,5) as zipcode, avg(latitude) as latitude, avg(longitude) as longitude 
		from mysql450.locations
		where zipcode <> 0
		group by substr(zipcode, 1,5) ) l 
	on
		 abs(l.latitude - cx.latitude) <= 0.01 and
		 abs(l.longitude - cx.longitude) <= 0.01
	where zipcode is not null and substr(c.date, 1, 6) = '201702'
	group by zipcode
) e
join (
	select zipcode, count(cx.crime_id) as crime_ct
	from mysql450.crime_location_xref cx
	join crimes c on cx.crime_id = c.crime_id
	left outer join ( 
		select substr(zipcode, 1,5) as zipcode, avg(latitude) as latitude, avg(longitude) as longitude 
		from mysql450.locations
		where zipcode <> 0
		group by substr(zipcode, 1,5) ) l 
	on
		 abs(l.latitude - cx.latitude) <= 0.01 and
		 abs(l.longitude - cx.longitude) <= 0.01
	where zipcode is not null and substr(c.date, 1, 6) = '201712'
	group by zipcode
) l
on e.zipcode = l.zipcode
