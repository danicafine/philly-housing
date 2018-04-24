var express = require('express')
var mysql = require('mysql');

var app = express()
app.set('port', (process.env.PORT || 5004));
app.use(express.static(__dirname + '/'));

conn = mysql.createConnection({
			  user     : 'mysql450',
			  password : 'clocktacoOJSimpson#',
			  port : 3306,
			  host : 'mysql450.cgqpuarl2hxx.us-east-1.rds.amazonaws.com'});
conn.query("USE mysql450")

app.get('/yes', function(request, response) {
	response.sendFile(__dirname + '/' + 'Philly_Trends.html')
})

app.get('/Philly_Trends.js', function(request, response) {
	response.sendFile(__dirname + '/' + 'js/Philly_Trends.js')
})

app.get('/neighborhood_prices', function(request, response) {
	response.sendFile(__dirname + '/' + 'neighborhood_prices.html')
})

app.get('/neighborhood_prices.js', function(request, response) {
	response.sendFile(__dirname + '/js/neighborhood_prices.js')
})

app.get('/neighborhood_safety', function(request, response) {
	response.sendFile(__dirname + '/' + 'neighborhood_safety.html')
})

app.get('/neighborhood_safety.js', function(request, response) {
	response.sendFile(__dirname + '/js/neighborhood_safety.js')
})

app.get('/nearby_transit', function(request, response) {
	response.sendFile(__dirname + '/' + 'nearby_transit.html')
})

app.get('/nearby_transit.js', function(request, response) {
	response.sendFile(__dirname + '/js/nearby_transit.js')
})

app.get('/nearby_transit/:id/:dist', function(request, response) {
	var dist_in_mi = parseFloat(request.params.dist) / 69;
	var text = 'select s.location_name, s.location_type from property_location_xref px \
     cross \
     join locations l \
     join septa_location_xref sx on \
          sx.latitude = l.latitude and \
          sx.longitude = l.longitude \
     join septa_locations s on \
          sx.septa_id = s.septa_id \
     where px.property_id = ' + request.params.id + ' \
       and abs(l.latitude - px.latitude) <= ' + dist_in_mi +  ' \
       and abs(l.longitude - px.longitude) <= ' + dist_in_mi;
	console.log(text);
	conn.query(text, function(err, rows, fields) {
		console.log("query complete")
		if (err) console.log(err);
		else {
			console.log(rows);
			response.json(rows);
		}
	})
})

app.get('/nearby_schools', function(request, response) {
	response.sendFile(__dirname + '/' + 'nearby_schools.html')
})

app.get('/nearby_schools.js', function(request, response) {
	response.sendFile(__dirname + '/js/nearby_schools.js')
})

app.get('/nearby_schools/:size/', function(request, response) {
	var text = "select\
         l.zipcode,\
         s.type,\
         s.subtype,\
         s.size\
     from schools s\
     join school_location_xref sx on\
          s.school_id = sx.school_id\
     join locations l on\
          l.latitude = sx.latitude and\
          l.longitude = sx.longitude\
     where s.size > 0 AND s.size <= " + request.params.size;
	console.log(text);
	conn.query(text, function(err, rows, fields) {
		if (err) console.log(err);
		else {
			console.log(rows);
			response.json(rows);
		}
	})
})

app.get('/neighborhood_crimes', function(request, response) {
	response.sendFile(__dirname + '/' + 'neighborhood_crimes.html')
})

app.get('/neighborhood_crimes.js', function(request, response) {
	response.sendFile(__dirname + '/js/neighborhood_crimes.js')
})

app.get('/zipcode_trends', function(request, response) {
	response.sendFile(__dirname + '/' + 'zipcode_trends.html')
})

app.get('/zipcode_trends.js', function(request, response) {
	response.sendFile(__dirname + '/js/zipcode_trends.js')
})

app.get('/zipcode_trends/:date', function(request, response) {
	var text = "select\
         substr(l.zipcode, 1, 5) as zipcode,\
         avg(ps.sale_price / pa.market_value) as market_indicator\
     from property_sold ps\
     join property_assessed pa on\
          pa.property_id = ps.property_id\
     join property_location_xref px on\
          ps.property_id = px.property_id\
     join locations l on\
          l.latitude = px.latitude and\
          l.longitude = px.longitude\
     where ps.date >= " + request.params.date + "\
     group by substr(l.zipcode, 1, 5)\
     having avg(ps.sale_price / pa.market_value) < 1\
	 order by market_indicator desc"
	console.log(text);
	conn.query(text, function(err, rows, fields) {
		console.log("query complete")
		if (err) console.log(err);
		else {
			console.log(rows);
			response.json(rows);
		}
	})
})

app.get('/safety_trends', function(request, response) {
	response.sendFile(__dirname + '/' + 'safety_trends.html')
})

app.get('/safety_trends.js', function(request, response) {
	response.sendFile(__dirname + '/js/safety_trends.js')
})

app.get('/safety_trends/:start/:end', function(request, response) {
	var text = "select e.zipcode, ((l.crime_ct - e.crime_ct) / e.crime_ct) as prcnt_change\
				from\
				(\
				select zipcode, count(cx.crime_id) as crime_ct\
				from mysql450.crime_location_xref cx\
				join crimes c on cx.crime_id = c.crime_id\
				left outer join ( \
					select substr(zipcode, 1,5) as zipcode, avg(latitude) as latitude, avg(longitude) as longitude \
					from mysql450.locations\
					where zipcode <> 0\
					group by substr(zipcode, 1,5) ) l \
				on\
					 abs(l.latitude - cx.latitude) <= 0.01 and\
					 abs(l.longitude - cx.longitude) <= 0.01\
				where zipcode is not null and substr(c.date, 1, 6) = "  + request.params.start+ "\
				group by zipcode\
				) e\
				join (\
				select zipcode, count(cx.crime_id) as crime_ct\
				from mysql450.crime_location_xref cx\
				join crimes c on cx.crime_id = c.crime_id\
				left outer join ( \
					select substr(zipcode, 1,5) as zipcode, avg(latitude) as latitude, avg(longitude) as longitude \
					from mysql450.locations\
					where zipcode <> 0\
					group by substr(zipcode, 1,5) ) l \
				on\
					 abs(l.latitude - cx.latitude) <= 0.01 and\
					 abs(l.longitude - cx.longitude) <= 0.01\
				where zipcode is not null and substr(c.date, 1, 6) = " + request.params.end	+ "\
				group by zipcode\
				) l\
				on e.zipcode = l.zipcode"
	console.log(text);
	conn.query(text, function(err, rows, fields) {
		console.log("query complete")
		if (err) console.log(err);
		else {
			console.log(rows);
			response.json(rows);
		}
	})
})

app.get('/queries', function(request, response) {
	response.sendFile(__dirname + '/' + 'queries.html')
})

app.get('/q1_cache.json', function(request, response) {
	response.sendFile(__dirname + '/json/q1_cache.json')
})

app.get('/q1_header.json', function(request, response) {
	response.sendFile(__dirname + '/json/q1_header.json')
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
  console.log(__dirname)
})

