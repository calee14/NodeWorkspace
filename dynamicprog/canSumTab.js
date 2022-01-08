const canSum = (targetSum, numbers) => {
    const table = Array(targetSum+1).fill(false);
    table[0] = true;
    for(let i=0;i<=table.length;i++) {
        for(let num of numbers) {
            if(table[i] === true) { // if the current element 
                                    // is true then we can reach here
                if(i+num < table.length) table[i+num] = true;
            }
        }
    }
    return table[targetSum];
}

console.log(canSum(7, [5, 3, 4, 7])) // -> true
console.log(canSum(7, [2, 4])) // -> false
console.log(canSum(300, [7, 14])) // -> false
