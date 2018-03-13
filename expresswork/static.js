var express = require('express');
var path = require('path')
var app = express();

app.use(express.static(process.argv[3] || path.join(__dirname, 'public')));

app.listen(process.argv[2]);
