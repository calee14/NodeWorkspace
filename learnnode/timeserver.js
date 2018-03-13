function now(date) {
	return [
		date.getFullYear(), '-', 
		date.getMonth() + 1, '-',
		date.getDate(), ' ', 
		date.getHours(), ':', 
		date.getMinutes()
	].reduce(function(before, current, count) {
		/* adds the string in the array together. zero fill*/
		return before + (count % 2 || ('' + current).length === 2 ? '' : '0') + current
	})
}

var net = require('net')
var server = net.createServer(function (socket){
	/* socket hanlding logic */
	socket.end(now(new Date()) + '\n')
})
server.listen(process.argv[2] | 0)

