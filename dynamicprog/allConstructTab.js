const allConstruct = (targetWord, words) => {
    // don't forget pass by ref thus need to map and create new 
    // instance of array
    const table = Array(targetWord.length + 1)
        .fill()
        .map(() => []); 
    table[0] = [[]];

    for(let i=0; i<=targetWord.length; i++) {
        if(table[i].length <= 0) continue;
        for(let word of words) {
            if(i+word.length > targetWord.length) continue;
            const prefix = targetWord.substr(i, word.length);
            if(prefix === word) {
                const newCombos = table[i].map((subArray) => [...subArray, word])
                table[i+word.length].push(...newCombos)
            }
        }
    }
    return table[targetWord.length]
}


console.log(allConstruct('abcdef', ['ab', 'abc', 'cd', 'def', 'abcd', 'ab', 'c']));
console.log(allConstruct('purple', ['purp', 'p', 'le', 'ur', 'purpl', 'e']));
console.log(allConstruct('skateboard', ['ska', 'sk', 'kate', 'board', 't']));
console.log(allConstruct('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeef', ['eee', 'ee', 'e', 'eeeeee', 'eeeeeeee']));