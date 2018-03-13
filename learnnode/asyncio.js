/* get access to the terminal */
var fs = require('fs');

fs.readFile(process.argv[2], function callBack(err, data) {
	/* if error print it out in the terminal*/
	if(err) {
		return console.log(err);
	}
	/*get the length of the string*/
	var lineCount = data.toString().split('\n').length - 1;
	console.log(lineCount);
})


