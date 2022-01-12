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
	4. entity header - contains info about the body of the header
- a http client can be any device that connects to the internet
- a http server contains the information that the clients want to access or run actions