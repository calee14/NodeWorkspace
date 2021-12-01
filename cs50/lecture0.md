# JS the programming language
## Prototypes
- All non-primative data types have a __pointer__ that gives access to the prototype. This prototype is also 
inherited from other objects, so the __\_\_proto\_\___ functions are shared among other classes.
    - primative datatypes are ints, float, bool, strings, char (symbol), null, undefined
- the prototype is an object with functions that the non-primative data type can access
- JS does some work for us and when declaring a "var" with a primative data type the JS compiler will wrap 
the primative variable in an object with a prototype.
- Functions are objects, thus have their own prototypes.
- In a JS class, class member functions are inside the prototypes. 
- Storing shared functions in prototypes helps with saving space in the computer
- Becareful of changing prototype functions for it will affect every other object with pointers to that prototype
## Execution context
- Execution contexts are the equivalent of __stack frames__ in C++
- It wraps vars and funcs local to a function's execution.
- A collection of execution contexts is known as the execution stack.
    - stacks (first in, last out). imagine stacking trays and take from the top
    - queues (first in, first out)
## Lexical Env
- With global variables and functions in functions, variables that have been declared with the same name as another at a global scope, the variable that will be referenced will always be the one with the closest proximity (closest scope, the immediate parent scope)
