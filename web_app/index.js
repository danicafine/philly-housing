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

app.get('/search', function(request, response) {
	response.sendFile(__dirname + '/' + 'search.html')
})

app.get('/search.js', function(request, response) {
	console.log("hello");
	response.sendFile(__dirname + '/js/search.js')
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
  console.log(__dirname)
})
