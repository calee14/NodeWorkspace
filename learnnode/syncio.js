// get filesystem library
var fs = require('fs');
// reads the terminal arguments/line
countNewLines(fs.readFileSync(process.argv[2]));
// count the lines
function countNewLines(text)  {
	// get the text split into an array at '\n'
	var lineCount = text.toString().split('\n').length - 1;
	// print
	console.log(lineCount);
}
