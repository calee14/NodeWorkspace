// file system searcher
var fs = require('fs');
// path finder
var path = require('path');

// read directories
fs.readdir(process.argv[2], function callback(err, list) {
	// if error
	if(err) {
		return console.log(err);
	}
	// filter out the array
	list.filter(function(file) { 
		// return if extension is equal to the thirt parameter
		return path.extname(file) === "." + process.argv[3];
	}).forEach(function (file) {
		// for each print out 
		console.log(file);
	})
})
