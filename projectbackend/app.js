/* import modules */
var express = require('express');
var exphbs  = require('express-handlebars');
var app = express()

app.use(express.static('public'));
/* set main layout to be main.handlebars */
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
/* set our view engine to be handlebars */
app.set('view engine', 'handlebars');

app.get('/', function(req, res) {
	res.render("home", {msg: ["Hello World", "Hello Word", "Hello World"]});
})

let row = [
	{careers: ['sdf', 'sd']},
	{careers: ['sd', 'df']},
	{careers: ['df', 'df', 'ds']}
]

app.get('/hi', function(req, res) {
	res.render("career", {row: row});
})
/* Hello World (Temporary)*/
app.get('/Hello World', function(req, res) {
	res.send("Hello World")
})
app.listen(3000, function() {
	console.log('Career Search listening on port localhost:3000!');
})