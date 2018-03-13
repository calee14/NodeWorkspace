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
/* Hello World (Temporary)*/
app.get('/Hello World', function(req, res) {
	res.send("hello")
})
app.listen(3000, function() {
	console.log('Career Search listening on port localhost:3000!');
})