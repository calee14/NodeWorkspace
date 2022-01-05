// memoization (use a memo to help remember this)
// store duplicate sub problems
// use a hashmap equivalent to store 

// in js it's da JSON, keys will be the arg to fn, value will be the return value

const fib = (n, memo = {}) => {
    if (n in memo) return memo[n];
    if(n <= 2) {
        return 1;
    }
    memo[n] = fib(n-1, memo) + fib(n-2, memo); // saving the value into the memos
                                            // the memo object is passed by ref
                                            // thus they have global info
    return memo[n];
}

console.log(fib(50));
