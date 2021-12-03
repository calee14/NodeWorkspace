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
    - https://stackoverflow.com/questions/10695629/what-is-the-parameter-next-used-for-in-express
- `then()` is a function that returns `Promise`. If there's a success with the `Promise` then the `then` func will run. `catch()` is the function that will catch isthe Promise fails
    - https://stackoverflow.com/questions/3884281/what-does-the-function-then-mean-in-javascript
    - https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/then

## Lexical Scoping
- Usually occurs when functions contain a child function. That child function will access variables in the parent object (funcs are objs) with priority rather than look at the global scope.
- Variables within the parent scope will also continue to be accessible to the 
child functions if the child functions access them

## Closures
- Closures is when a function returns a function obj that can be stored in a variable and can be called to use the '()'
    - These closure functions will still have access to parent member variables even when the parent func obj has been dereferenced
- __Important example: Immediately Invoked Function Expression (IIFE)__
```javascript
function makeFunctionArray() {
    var arr = [];

    for(var i=0;i<5;i++) {
        arr.push( // 0. we're going to push a closure here the use of () to create an expression
            (function(x) { // 1. notice here that the () surround the function making it an expression waiting to be called
                return function() { // 2. the funciton within the () returns a func obj that prints the x variable
                    console.log(x); // 3. this will print the nums 0, 1, 2, 3, 4 because the 'lexical scoping' will continue to
                                    // reference the value/vars stored in the parent func obj
                }
            })(i) // 1. and notice here that the '(i)' will call/invoke the function obj that's between the () <- an expression
        )
    }
}
```