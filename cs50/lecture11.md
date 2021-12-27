# Authentication
- token-based auth = a token is stored in the header of every request and the server will check to see if the token is valid or not to give access to the client.
    - pros: is that it is scalable, doesn't require server to store sessions
    - Ex: JWT (json web tokens)
        - there are three parts to a token
        - header (type of token, hash algo); payload (info); signature (sign the token)
