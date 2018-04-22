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

app.get('/', function(request, response) {
	response.sendFile(__dirname + '/' + 'index.html')
})

app.get('/neighborhood_prices', function(request, response) {
	response.sendFile(__dirname + '/' + 'neighborhood_prices.html')
})

app.get('/neighborhood_prices.js', function(request, response) {
	console.log("hello");
	response.sendFile(__dirname + '/js/neighborhood_prices.js')
})

app.get('/nearby_transit', function(request, response) {
	response.sendFile(__dirname + '/' + 'nearby_transit.html')
})

app.get('/nearby_transit.js', function(request, response) {
	response.sendFile(__dirname + '/js/nearby_transit.js')
})

app.get('/nearby_transit/:id/:dist', function(request, response) {
	text = 'select s.location_name, s.location_type from property_location_xref px on \
     cross \
     join locations l \
     join septa_location_xref sx on \
          sx.latitude = l.latitude and \
          sx.longitude = l.longitude \
     join septa_locations s on \
          sx.septa_id = s.septa_id \
     where px.property_id = $PROPERTY_ID -- SELECT FOR A GIVEN PROPERTY \
       and abs(l.latitude - px.latitude) <= $DIST \
       and abs(l.longitude - px.longitude) <= $DIST';
	console.log(text);
	console.log(request.params.dist);
	console.log(request.params.id);
	var dist_in_mi = parseFloat(request.params.dist) / 69;
	var formatted = text.replace("$DIST", dist_in_mi.toString());
	formatted = formatted.replace("$PROPERTY_ID", parseInt(request.params.id));
	conn.query(formatted, function(err, rows, fields) {
		if (err) console.log(err);
		else {
			response.json(rows);
		}
	})
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
