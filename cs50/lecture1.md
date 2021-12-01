# Advanced JS
## Primative vs. Object
- Objects are passed onto other variables by reference (pointers)
- primatives are passed onto each other by value (copying val and placing it into the var)
- __this__ keyword used to refer to the parent object. JS isn't neccesarily object-oriented but
 uses prototype inheritance
- `this` has functions `bind(), call(), apply()`. Example for bind:
```javascript
var person = {
    name: "Jordon",
    greet: function() { console.log('Hi, ' + this.name) }
};

person.greet(); // Hi, Jordon

var student = {
    name: 'John',
};

var studentGreet = person.greet.bind(student); // will bind the function obj from the person obj to the student obj
                                                // this will return a func obj with the correct `this` reference

studentGreet(); // Hi, John

console.log(JSON.strinify(student)) // {'name': 'John'} NOTE: the greet func isn't there 

```
## First class functions
- `Array` has map(), filter(), sort(), and reduce() <-sums all elements functions
    - these functions return an array after applying a function to the entire list

## JS Single Threaded, Synchronous language
- JS executes each process one at a time
- However, there's __asyncronous javascript__
- Here's how it works:
![JS V8 engine](https://prashantb.me/content/images/2017/01/js_runtime.png)
- The event loop will take in functions from the queue which received them from the __Browser API__ to the gloabl stack (js execution) 
- The execution stack is for all syncronous actions
- Callbacks are important for asyncronous calls when they finish
- For future lectures but the __`next()`__ in express.js/node.js is for skipping to the next middleware
- `then()` is a function that returns `Promise`. If there's a success with the `Promise` then the `then` func will run. `catch()` is the function that will catch isthe Promise fails