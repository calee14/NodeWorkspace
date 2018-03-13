/* import modules */
var express = require('express');
var exphbs  = require('express-handlebars');
var app = express()

/* set main layout to be main.handlebars */
app.engine('handlebars', exphbs({defautLayout: 'main'}));
/* set our view engine to be handlebars */
app.set('view engine', 'handlebars');

app.get('/', function(req, res) {
	res.render("temp", {gifUrl: "http://media2.giphy.com/media/gYBVM1igrlzH2/giphy.gif"})
})
/* Hello World (Temporary)*/
app.get('/Hello World', function(req, res) {
	res.send("hello")
})
app.listen(3000, function() {
	console.log('Career Search listening on port localhost:3000!');
})