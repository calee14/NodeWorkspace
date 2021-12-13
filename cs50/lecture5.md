# Making an API
## Planning the API
- write out properties of classes/objects
- making the user seems to be the most important
- https://www.cqlcorp.com/insights/best-practices-for-securing-your-rest-api-authentication-options/
    - https://restfulapi.net/security-essentials/
        - how to secure an api for auth
    - https://webmasters.stackexchange.com/questions/31212/difference-between-the-accept-and-content-type-http-headers
        - content-type = the content-type that's in the request or response
        - accept = the content type that the http client will accept or can read in
## Making the server
```javascript
module.exports = { // module.exports will export an object
    port: 3000
}
```
- `bodyParser.json()` and `bodyParser.urlencoded({extended: false})` are middleware that parsers request obj form data and headers into the body prop
    - https://stackoverflow.com/questions/38306569/what-does-body-parser-do-with-express