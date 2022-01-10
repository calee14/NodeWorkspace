const canConstruct = (targetWord, words) => {
    const table = Array(targetWord.length + 1).fill(false);
    // since we know that index zero we can construct a string with no char
    // then we set index 0 with true 
    // then the substr that follow after. the indexes will be updated bc
    // we know that we can generate that str based on position 0
    // this pattern is repeated for the other indexes when we reach there.
    table[0] = true;

    for(var i=0; i<=targetWord.length;i++) {
        if(table[i] !== false) {
            for(let word of words) {
                if (i+word.length > targetWord.length) continue;
                const prefix = targetWord.substr(i, word.length);
                if (prefix === word) table[i+word.length] = true;
            }
        }
    }
    return table[targetWord.length]
}

console.log(canConstruct('abcdef', ['ab', 'abc', 'cd', 'def', 'abcd']));
console.log(canConstruct('skateboard', ['ska', 'sk', 'kate', 'board', 't']));
console.log(canConstruct('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeef', ['eee', 'ee', 'e', 'eeeeee', 'eeeeeeee']));