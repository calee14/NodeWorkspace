var express = require('express');
var crypto = require('crypto');
var app = express();

app.put('/message/:name', (req, res) => {
	var name = req.params.name
	var str = crypto
		.createHash('sha1')
		.update(new Date().toDateString() + name)
		.digest('hex');
	res.send(str);
})
app.listen(process.argv[2]);