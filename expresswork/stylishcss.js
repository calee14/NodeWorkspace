var express = require('express');
var stylus = require('stylus');
var app = express();

app.use(stylus.middleware(process.argv[3]));
app.use(express.static(process.argv[3]));

app.listen(process.argv[2]);