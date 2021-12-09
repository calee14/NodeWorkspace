# Node and Express
## Exporting code
- moddule.exports = object that will export code
- require() = import code from other files

## Express
- minimal lightweight web app framework
- very powerful routing system:
```javascript
    app.<method>(<path>, callback)
        <method> is an all-lowercase http request method (get, post, etc.)
        <path> is the visited path in the URL
        callback is a function that takes 2-3 params
            - req = request obj
            - res = response obj
                - res.send() = will complete the response and send it back to the origin of the request
            - next = optional callback function to run next callback (used for middlewares)