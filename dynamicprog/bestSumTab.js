const bestSum = (targetSum, numbers) => {
    const table = Array(targetSum+1).fill(null);
    table[0] = [];
    for(let i=0;i<=targetSum;i++) {
        if (table[i] !== null) {
            for(let num of numbers) {
                const combo = [...table[i], num];
                if(i+num <= table.length && 
                    (!table[i+num] || table[i+num].length > combo.length)) {
                    table[i+num] = combo;
                }
            }
        }
    }
    return table[targetSum];
}


console.log(bestSum(7, [2, 3, 7]));
console.log(bestSum(7, [4, 3, 5, 2]));
console.log(bestSum(8, [1, 4, 5]));
console.log(bestSum(100, [1, 10, 25]));