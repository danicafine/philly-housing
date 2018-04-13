var express = require('express')
var oracledb = require('oracledb');
oracledb.getConnection({
  user     : 'cis450db',
  password : 'cis450db',
  connectString : 'cis450db.cgqpuarl2hxx.us-east-1.rds.amazonaws.com/cis450db'
}, function(err, conn) {
	if (err) {
		console.log(err.message);
		return;
	}
	conn.ping(function(err) {
		if (err) {
		console.log("Encountered error while pinging");
		console.log(err.message);
		}
	})
	conn.execute("select * from Septa;", function(er, res) {
		if (er) {
			console.log("Reporting the following query error:");
			console.log(er.message);
			console.log("Query failed; connection closing.");
			return;
		}
		console.log(res.rows);
	})
	conn.close();
});
var app = express()
app.set('port', (process.env.PORT || 5001));
app.use(express.static(__dirname + '/public'));

//// app.all('/*', function(req, res, next) {
//// 	res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");
//// })
//
//app.get('/bikes', function(request, response) {
//	response.sendFile(__dirname + '/' + 'bikes.html');
//})
//
//app.get('/script.js', function(request, response) {
//	response.sendFile(__dirname + '/' + 'script.js');
//})
//
//app.get('/getFriends', function(request, response) {
//	var query = 'SELECT name, num_friends FROM (SELECT login, COUNT(login) as num_friends FROM Friends GROUP BY login) C JOIN Person P ON C.login = P.login;'
//	console.log(query)
//	connection.query(query, function(err, rows, fields) {
//		if (err) console.log(err);
//    	else {
//        	response.json(rows);
//    	} 
//	})
//})
//
//app.get('/getFamily/:name', function(request, response) {
//	var queryPrefix = 'SELECT q.login, q.name, q.sex, q.relationshipStatus, q.birthyear, r.role FROM Person q JOIN (SELECT f.member, role, sex, relationshipStatus, birthyear FROM (SELECT * FROM Person WHERE name = \''
//	var queryPostfix = '\') p JOIN Family f ON p.login = f.login) r ON q.login = r.member;'
//	var query = queryPrefix + request.params.name + queryPostfix;
//
//	connection.query(query, function(err, rows, fields) {
//		if (err) console.log(err);
//    	else {
//        	response.json(rows);
//    	} 
//	})	
//})
//
//app.get('/friends', function(request, response) {
//	response.sendFile(__dirname + '/' + 'friendships.html')
//})
//
//
//app.get('/friendscript.js', function(request, response) {
//	response.sendFile(__dirname + '/' + 'friendscript.js');
//})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
  console.log(__dirname)
})
