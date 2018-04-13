var express = require('express')
var oracledb = require('oracledb');

var app = express()
app.set('port', (process.env.PORT || 5004));
app.use(express.static(__dirname + '/public'));

oracledb.getConnection({
  user     : 'cis450db',
  password : 'cis450db',
  port : 1521,
  connectString : 'cis450db.cgqpuarl2hxx.us-east-1.rds.amazonaws.com/cis450db/'
}, function(err, conn) {
	if (err) {
		console.log(err.message);
		return;
	}
	console.log("Obtained some sort of initial connection.")
	console.log(conn.oracleServerVersionString)
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
			return
		}
		console.log(res.rows);
	}) 
	conn.close();
});

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
  console.log(__dirname)
})
