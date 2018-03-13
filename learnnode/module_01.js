/* import other modules */
var fs = require('fs');
var path = require('path');

/* when module gets called */
module.exports = function(directory, filter, callback) {
	/* filter string*/
	filter = '.' + filter;
	/* read the directory based on the parameters */
	fs.readdir(directory, function (error, list) {
	/* if the is an error */
    if (error) {
      return callback(error);
    }
    /* run the callback function */
    callback(null, list.filter(function (entry) {
      return path.extname(entry) === filter;
    }))
  })
}