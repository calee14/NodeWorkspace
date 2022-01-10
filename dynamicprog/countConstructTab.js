const countConstruct = (targetWord, words) => {
    const table = Array(targetWord.length + 1).fill(0);
    table[0] = 1;

    for(let i=0; i<=targetWord.length; i++) {
        if(table[i] > 0) {
            for(let word of words) {
                if (i+word.length > targetWord.length) continue;
                const prefix = targetWord.substr(i, word.length);
                // don't forget to increment the value stored at the current position
                // not by one
                if (prefix === word) table[i+word.length] += table[i];
            }
        } 
    }
    return table[targetWord.length]
};

console.log(countConstruct('abcdef', ['ab', 'abc', 'cd', 'def', 'abcd', 'ab', 'c']));
console.log(countConstruct('skateboard', ['ska', 'sk', 'kate', 'board', 't']));
console.log(countConstruct('enterapotentpot', ['a', 'p', 'ent', 'enter', 'ot', 'o', 't']))
console.log(countConstruct('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeef', ['eee', 'ee', 'e', 'eeeeee', 'eeeeeeee']));
