const howSum = (targetSum, numbers) => {
    const table = Array(targetSum+1).fill(null);
    table[0] = [];

    for(let i=0;i<=table.length;i++) {
        if(table[i] !== null) {
            for(let num of numbers) {
                if(table[i] !== null && i+num < table.length) {
                    table[i+num] = [...table[i], num];
                }
            }
        }
    }
    return table[targetSum]
}


console.log(howSum(7, [2, 3]));
console.log(howSum(7, [4, 3, 5, 2]));
console.log(howSum(300, [14, 7]));