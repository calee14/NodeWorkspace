/* get the module and run the funtion */
var module_01 = require('./module_01.js')
module_01(process.argv[2], process.argv[3], function(error, list) {
	/* if there is a error */
	if(error) {
		return console.log(error);
	}
	/* list every file in list */
	list.forEach(function(entry) {
		console.log(entry);
	})
})