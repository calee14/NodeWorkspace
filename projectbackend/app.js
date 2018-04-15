/* import modules */
var express = require('express');
var exphbs  = require('express-handlebars');
var pg = require("pg");
var app = express();

/* connection string to for db */
var connectionString = "postgres://postgres:capsdatabase@localhost:5432/careersearchdb"

app.use(express.static('public'));

/* set main layout to be main.handlebars */
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
/* set our view engine to be handlebars */
app.set('view engine', 'handlebars');

app.get('/', function(req, res) {
	// pg.connect(connectionString, function (err, client, done) {
	// 	if(err) {
	// 		console.log("not able to get connection " + err);
	// 		res.status(400).send(err);
	// 	}
	// 	client.query('SELECT * FROM majoroccupations', function(err, result) {
	// 		done();
	// 		if(err) {
	// 			console.log(err);
	// 			res.status(400).send(err);
	// 		}
	// 		res.status(200).send(result.rows);
	// 	});
	// });
	res.render("home", {msg: ["Hello World", "Hello Word", "Hello World"]});
});

let row = [
	{careers: ['sdf', 'sd']},
	{careers: ['sd', 'df']},
	{careers: ['df', 'df', 'ds']}
]

app.get('/hi', function(req, res) {
	res.render("career", {row: row});
})

app.get('/career', function(req, res) {
	res.render("careerinfo");
})
/* Hello World (Temporary)*/
app.get('/Hello World', function(req, res) {
	res.send("Hello World")
})
app.listen(3000, function() {
	console.log('Career Search listening on port localhost:3000!');
})