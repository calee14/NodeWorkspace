/* import modules */
var express = require('express');
var exphbs = require('express-handlebars');
var http = require('http');
var giphy = require('giphy-api')();

/* set up application */
var app = express();

/* set view engine to handlebars and default to 'main' */
/* default page: home page or the first page the user is directed to */
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

/* add layers of middleware 'public' css */
app.use(express.static('public'));

/* */
app.get('/', function (req, res) {
	/* get the string from the form*/
	var queryString = req.query.term;
	/* ecode it */
	var term = encodeURIComponent(queryString);
	/* put the term into our search */
	var url = 'http://api.giphy.com/v1/gifs/search?q=' + term + '&api_key=dc6zaTOxFJmzC';
	/* get the data */
	http.get(url, function(response) {
		response.setEncoding('utf8');
		
		var body = '';

		response.on('data', function(d) {
			// continuously update stream with data
			body += d;
		});

		response.on('end', function() {
			// data reception is done, do whatever with it!
			var parsed = JSON.parse(body);
			res.render('home', {gifs: parsed.data})
		});
	});
});

app.get('/hello-world', function (req, res) {
	res.send('Hello World');
});

app.get('/hello-gif', function (req, res) {
	var gifUrl = 'http://media2.giphy.com/media/gYBVM1igrlzH2/giphy.gif'
	res.render('hello-gif', {gifUrl: gifUrl});
});

app.get('/greetings/:name', function(req, res) {
	var name = req.params.name;
	res.render('layouts/greetings', {name: name});
});

app.listen(3000, function () {
	console.log('Gif Search listening on port localhost:3000');
});








