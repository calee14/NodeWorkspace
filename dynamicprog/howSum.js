const howSum = (targetSum, numbers, memo={}) => {
    if (targetSum in memo) return memo[targetSum]
    if(targetSum === 0) return []; // note to self: === is a strict equality 
                                //comparison thus the variables must be of
                                // the same data type. Ex: int compared to int
    if(targetSum < 0) return null;

    for(let num of numbers) {
        const remainder = targetSum - num;
        const remainderRes = howSum(remainder, numbers, memo);
        if (remainderRes !== null) {
            // unpack remainderRes and add remainder
            memo[targetSum] = [...remainderRes, num]; 
            return memo[targetSum];
        }
    }

    // set the memo to null so we know that it's impossible to 
    // reach the target number
    memo[targetSum] = null;
    return null;
};

// m = target sum
// n = numbers.length
// 
// Brute Force
// time : O(n^m * m) but need to include how we iterate through 
//                  remainderRes to expand it
// space : O(m)
// Memoized
// time : O(n*m^2)
// space: O(m^2)

console.log(howSum(7, [2, 3]));
console.log(howSum(7, [4, 3, 5, 2]));
console.log(howSum(300, [14, 7]));

