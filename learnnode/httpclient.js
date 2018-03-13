var http = require('http');

http.get(process.argv[2], function processResponse (res) {
	/* set language to a specific bit - ENGLISH ASCII */
	res.setEncoding('utf8');
	/* when event name is called, 'data', run the callback function*/
	res.on('data', console.log);
	/* when event name is called, 'error', run the callback function*/
	res.on('error', console.error);
}).on('error', console.error);

