module.exports = {
	cleanString: function (input) {
		var newString = input;
		var specialCharacters = [',', '-', '(', ')'];
		/* loop through the special characters we want to remove */
		for(var j=0;j<specialCharacters.length;j++) {
			/* loop through all of the characters */
			for(var i=0;i<newString.length;i++) {
				if(newString[i] == specialCharacters[j]) {
					newString = newString.slice(0, i) + newString.slice(i+1);
				}
			}
		}
		return newString.split(' ').join('_');
	}
}