/* import http module */
var http = require('http')
/* import url module */
var url = require('url')
/* create the server */
var server = http.createServer(function (request, response) {
	/* create a new Date object */
	var time = new Date(url.parse(request.url, true).query.iso)
	/* set the result */
	var result = 
	/* try parsing time */
	/^\/api\/parsetime/.test(request.url)
		/* get parsed time */
		? {
			hour: time.getHours(),
			minute: time.getMinutes(),
			second: time.getSeconds()
		}
		/* get unix time */
		: /^\/api\/unixtime/.test(request.url)
			? { unixtime: time.getTime() }
			: null
	if (result) {
		/* set status code and headers */
		response.writeHead(200, 'Content-Type: application/json')
		result = JSON.stringify(result)
	} else {
		/* set status code */
		response.writeHead(404)
	}
	/* end the response and send the headers */
	response.end(result)
})
/* find the server on the port*/
server.listen(process.argv[2] | 0)

/* version 2 */
/*
var http = require('http')
var url = require('url')

function parsetime (time) {
	return {
		hour: time.getHours(),
		minute: time.getMinutes(),
		second: time.getSeconds()
	}
}

function unixtime (time) {
	return {
		unixtime: time.getTime()
	}
}

var server = http.createServer(function (request, response) {
	var parsedUrl = url.parse(request.url, true)
	var time = new Date(parsedUrl.query.iso)
	var result;

	if (/^\/api\/unixtime/.test(request.url)) {
		result = parsetime(time)
	} else if (/^\/api\/unixtime/.test(request.url)) {
		result = unixtime(time)
	}

	if (result) {
		response.writeHead(200, 'Content-Type: application/json')
		result = JSON.stringify(result)
	} else {
		response.writeHead(404)
	}

	response.end(result)
})
*/