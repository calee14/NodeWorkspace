# Middleware
## Express Middleware
- helps structure an API -> express obj is a chain of middleware functions.
- all middleware functions are given access to the request and response objs and the next middleware function
- the middleware can be mounted onto a route or at a global scope meaning all routes the middleware will be run
- these middleware can modify the requets and response objs
    - then the middleware can pass on the modifications to the next middleware by using a callback `next()`
    - end the middleware chain by using res.send()
        - however, a request can hang if the api never sends a response
- `app.use(middleware)` - the middleware being placed into the app obj will run everytime we receive a request

## RESTful services
- Representative State Transfer
    - a good structure for apis
- REST constraints
    - stateless = user context not stored on server. won't remember every detail of every user
    - descriptive messages = request and response contains informaiton for the client and server to understand
    - consistent resource identifiers (structure of url) = organized way to fetch obj from client. ex: url paths, and http methods(get, post, delete, put (update))
    - client-server = seperation between the client and server
    - cacheable = identify responses so don't rerequest the same things

## HTTP (HyperText Transfer Protocol)
- verion = version of http
- location = url but translated to IP addresses
- method = http methods (get, post)
- path = path of the url