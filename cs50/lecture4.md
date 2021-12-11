# Middleware
## Express Middleware
- helps structure an API -> express obj is a chain of middleware functions.
- all middleware functions are given access to the request and response objs and the next middleware function
- the middleware can be mounted onto a route or at a global scope meaning all routes the middleware will be run
- these middleware can modify the requets and response objs
    - then the middleware can pass on the modifications to the next middleware by using a callback `next()`
    - end the middleware chain by using res.send()
        - however, a request can hang if the api never sends a response