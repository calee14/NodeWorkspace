const allConstruct = (targetWord, words, memo={}) => {
    if(targetWord in memo) return memo[targetWord];
    if (targetWord.length === 0) return [[]];
    
    const result = []
    for (let word of words) {
        const prefix = targetWord.substr(0, word.length);
        if(word === prefix) {
            const suffix = targetWord.slice(word.length);
            const suffixWays  = allConstruct(suffix, words, memo);
            const targetWays = suffixWays.map((way) => {
                return [word, ...way];
            });
            result.push(...targetWays); // must spread out ways to keep track
                                        // of ways by comma separating
        }
    }
    memo[targetWord] = result;
    return result;
}

// memoized
// O(n*m^2) time
// O(m^2) space

console.log(allConstruct('abcdef', ['ab', 'abc', 'cd', 'def', 'abcd', 'ab', 'c']));
console.log(allConstruct('purple', ['purp', 'p', 'le', 'ur', 'purpl', 'e']));
console.log(allConstruct('skateboard', ['ska', 'sk', 'kate', 'board', 't']));
console.log(allConstruct('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeef', ['eee', 'ee', 'e', 'eeeeee', 'eeeeeeee']));
