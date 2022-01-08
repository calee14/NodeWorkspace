const fib = (n) => {
    const table = Array(n + 1).fill(0); // gives empty array of n+1 size
    table[1] = 1; // seeding index 1 with 1 for the first two values of fib
    for(var i=0; i<=n; i++) {
        table[i+1] += table[i];
        table[i+2] += table[i];
    }
    return table[n];
}

console.log(fib(6));
console.log(fib(50));