const fib = (n) => {
    if(n <= 2) {
        return 1;
    }
    return fib(n-1) + fib(n-2);
}

console.log(fib(6));
console.log(fib(9));

const foo = (n) => {
    if (n <= 1) return ;
    foo(n-1);
};

foo(5); // O(n) time complexity thus it runs n times
        // O(n) space complexity thus is uses n units of space

const bar = (n) => {
    if (n <= 1) return;
    bar(n - 2);
};

bar(6); // O(n/2) = O(n) time complexity
        // O(n/2) = O(n) space

const dib = (n) => {
    if (n <= 1) return;
    dib(n - 1);
    dib(n - 1);
}

dib() // O(2^n) time
    // O(n) space because the recur func call get's removed from stack
    // so the max size of stack is the height of the tree or 'n'