# User Authentication with Node.js, Passport.js, Express.js
- User Auth choices:
	- session
	- jwt
	- __OAuth__
		- a protocol to give access rights to users who want to use an API
		- seperates user authentication into authentication and authorization (which user has access to what)
- __Passport.js__
	- passport.js is a middleware that will handle user authentication
	- this middleware will run on every http request to the server
		- passport.js will use a __"strategy"__ to determine if the user has access to view the app
	- the strategies that passport uses are cookies, express-sessions, and auth logic
	- passport.js middleware also contain other middleware that connect with other auth strategies

# HTTP headers
- a network http header is used to transmit information between the clients and the server through request and response header
	1. general header - type of header applied on both request and response headers
		- meta data about request, such as url, request method (request info)
		- status code (for the response meta data)
	2. request header - contains info about the fetch request sent by the client
		- contains information on what the client will accept
		- can contain cookie
	3. response header - the header contains the source/server and information for that server that the client requested
		- server will set the resp headers, instructions/info for the client
		- contains type of what the data sent from the server
		- there's a 'set-cookie' header to store cookies
			- good for storing user sessions in the application
			- these cookies have an expiration date
	4. entity header - contains info about the body of the header
- a http client can be any device that connects to the internet
- a http server contains the information that the clients want to access or run actions

# Express middleware
```js
const express = require('express');

const app = express();

// use a global middleware that will run on every request to the server
// order of the middleware matters
app.use(middleware0);
app.use(middleware1);

function middleware0(request, response, next) {
	console.log('I am a middleware');
	// express middleware will take the request js object
	// and append new properties to the request obj.
	request.customVal = 100;

	// the next param is a func that when invoked will call the next middleware
	next(); 
}

function middleware1(request, response, next) {
	console.log('I am the second middleware');
	console.log('Our custom value', request.customVal);

	const errorObj = new Error('Error found');

	next(errorObj);
}

function middleware2(request, response, next) {
	console.log("I'm the third middleware");
	next();
}


function errorMiddleware(error, request, response, next) {
	if (error) {
		res.send('There was an error please try again');
	}
}

// the paramteters are all objs from the express lib
function callback(request, response, nextMiddleware) {
	res.send('<h1>Hello World</h1>');
}

// first run a route-specific middleware() code then callback()
app.get('/', middleware2, callback);

app.get('/', (req, res, next) => {
	console.log('code for home route');
	res.send(`<h1>Hello World, ${req.customVal}</h1>`);
});

// error handler should be placed after all middleware
// should an error appear in our middleware or routes then
// it will skip to the middleware that handles the errors
app.use(errorMiddleware);

app.listen(5000)
```