var express = require('express');
var fs = require('fs');
var app = express();

app.get('/books', (req, res) => {
	var filename = process.argv[3];
	fs.readFile(filename, (e, data) => {
		if (e) return res.sendStatus(500);
		try {
			object = JSON.parse(data);
		} catch(e) {
			res.sendStatus(500);
		}
		res.json(object);
	})
})
app.listen(process.argv[2]);