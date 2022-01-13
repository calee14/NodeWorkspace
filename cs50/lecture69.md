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

# Express session 
- passport local uses express session under the hood
- state management handled on the front end
	- but backend still can have influence over app state
- for sessions server can store user data and more of it rather than putting it all into the cookie
	- session is stored on the server and cookie is client
```js
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');

const MongoStore = require('connect-mongo')(session);

var app = express();
const dbString = 'mongodb://localhost:27017/tutorial_db';
const dbOptions = {
	useNewUrlParser: true,
	useUnifiedTopology: true,
}

const connection = mongoose.createConnection(dbString, dbOptions);

// parse the request obj
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const sessionStore = new MongoStore({
	mongooseConnection: connection,
	collection: "sessions"
});

// session middleware 
// will store a session_id in the client
app.use(session({
	secret: 'some-secret',
	resave: false,
	saveUninitialized: true,
	store: sessionStore,
	cookie: {
		maxAge: 1000 * 60 * 60 * 24 // for cookie expiration: one day
	}
}));

app.get('/', (req, res, next) => {
	// the express-session will parse the cookie session_id
	// and store the cookie obj in the session
	console.log(req.session);
	if (req.session.viewCount) {
		// when we set the viewCount to the session obj
		// the value persisted in the db
		req.session.viewCount = req.session.viewCount + 1;
	} else {
		req.session.viewCount = 1;
	}
	res.send('hello world. the world has visited, ', req.session.viewCount, 'times');
});

app.listen(5000);
```