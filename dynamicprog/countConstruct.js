const countConstruct = (targetWord, words, memo={}) => {
    if(targetWord in memo) return memo[targetWord]
    if(targetWord.length === 0) return 1;
    if(targetWord.length < 0 ) return 0;

    // keep track of the 
    let totalCount = 0;

    for(let word of words) {
        const prefix = targetWord.substr(0, word.length);
        if(word === prefix) {
            const suffix = targetWord.slice(word.length);
            const numWaysForRest = countConstruct(suffix, words, memo)
            totalCount += numWaysForRest
        }
    }
    memo[targetWord] = totalCount
    return totalCount;
}

// memoized
// O(n*m^2) time
// O(m^2) space

console.log(countConstruct('abcdef', ['ab', 'abc', 'cd', 'def', 'abcd', 'ab', 'c']));
console.log(countConstruct('skateboard', ['ska', 'sk', 'kate', 'board', 't']));
console.log(countConstruct('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeef', ['eee', 'ee', 'e', 'eeeeee', 'eeeeeeee']));
