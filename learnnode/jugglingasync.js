/* import library */
var http = require('http')
/* initialize variables */
var count = 0
var feed = []
var url = process.argv.slice(2)

function allDone() {
	/* increment count */
	count += 1
	/* print feed */
	if(count == feed.length) {
		feed.forEach(function(value) {
			console.log(value)
		})
	}
}

url.forEach(function(url, index) {
	/* get new index */
	feed[index] = ''
	/* send a request to url */
	http.get(url, function(response) {
		/* set response to software-readable text */
		response.setEncoding('utf-8')
		/* when response sees data */
		response.on('data', function(data) {
			feed[index] += data
		})
		/* when response sees end */
		response.on('end', allDone)
	})
})
