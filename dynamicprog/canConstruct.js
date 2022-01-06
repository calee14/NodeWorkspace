const canConstruct = (targetWord, words, memo={}) => {
    if(targetWord in memo) return memo[targetWord];
    if(targetWord.length === 0) return true;
    if(targetWord.length < 0 ) return false;

    for(let word of words) {
        const subStr = targetWord.substr(0, word.length);
        if(word === subStr) {
            const suffix = targetWord.slice(word.length);
            if(canConstruct(suffix, words, memo) === true) {
                memo[suffix] = true;
                return true;
            }
        }
    }
    memo[targetWord] = false;
    return false;
}

console.log(canConstruct('abcdef', ['ab', 'abc', 'cd', 'def', 'abcd']));
console.log(canConstruct('skateboard', ['ska', 'sk', 'kate', 'board', 't']));
console.log(canConstruct('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeef', ['eee', 'ee', 'e', 'eeeeee', 'eeeeeeee']));
