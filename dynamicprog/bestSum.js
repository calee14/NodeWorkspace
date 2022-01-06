const bestSum = (targetSum, numbers, memo={}) => {
    if(targetSum in memo) return memo[targetSum];
    if(targetSum === 0) return [];
    if(targetSum < 0) return null;

    let shortestCombination = null

    for(let num of numbers) {
        const remainder = targetSum - num;
        const remainderRes = bestSum(remainder, numbers, memo);

        if(remainderRes !== null) {
            const combination = [...remainderRes, num];
            // if the combination is shorter than the current 'shortest'
            // then update it
            if (shortestCombination === null || combination.length < shortestCombination.length) {
                shortestCombination = combination;
            }
        }
    }
    memo[targetSum] = shortestCombination;
    return shortestCombination;
}

// complexity
// m = target sum
// n = numbers.length
// 
// Brute Force
// time: O(n^m * m) the multiplying by m comes from expanding the remainder
// space: O(m^2) squaring m or multiplying by m because we're storing an array with the shortest path
//
// Memoized
// time: O(m*n*m) or O(m^2 * n) 
// space: O(m^2)

console.log(bestSum(7, [2, 3, 7]));
console.log(bestSum(7, [4, 3, 5, 2]));
console.log(bestSum(8, [1, 4, 5]));
console.log(bestSum(100, [14, 7, 25]));