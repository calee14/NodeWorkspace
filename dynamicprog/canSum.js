const canSum = (targetSum, numbers, memo={}) => {
    if (targetSum in memo) return memo[targetSum]
    if(targetSum === 0) return true;
    if(targetSum < 0) return false;

    for(let num of numbers) {
        const remainder = targetSum - num;
        memo[targetSum] = canSum(remainder, numbers, memo)
        if (memo[targetSum] === true) {
            return true;
        }
    }
    return false;
}

console.log(canSum(7, [5, 3, 4, 7])) // -> true
console.log(canSum(7, [2, 4])) // -> false
console.log(canSum(300, [7, 14])) // -> false

