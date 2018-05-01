module.exports = {
	getDuties: function(object, index) {
		return object[index][0]["duties"];
	},
	getHowToBecome: function(object, index) {
		var new_object = object[index][0];
		for(var key in new_object) {
			if(new_object.hasOwnProperty(key)) {
				console.log(key + " -> " + new_object[key][0]);
			}
		}
	},
	getSkills: function(object, index) {
		var new_object = object[index][0];
		var count = 0;
		for(var key in new_object) {
			if(count < 2) {count += 1; continue;}
			if(new_object.hasOwnProperty(key)) {
				howtobecome = new_object[key];
				if(howtobecome == null) {continue;}
				
				if(howtobecome[0].includes("skills") && howtobecome[0].length <= 50 || howtobecome[0].includes("skills") && howtobecome[0].length <= 50) {
					var skills = []
					for (var i = 0; i < howtobecome.length; i+=2) {
						skills.push(howtobecome[i] + " "+ howtobecome[i+1]);
					}
					console.log(skills)
					return skills;
				}
				
			}
			count += 1;
		}
		return -1;
	},
	getPoints: function(object, index) {
		var current_e = parseInt(object[index][0]["employment_2016_0"].replace(/,/g, ""));
		var projected_e = parseInt(object[index][0]["projected_employment_2026_0"].replace(/,/g, ""));
		return [current_e, projected_e];
	},
	getPercentage: function(object, index) {
		var current_p = parseInt(object[index][0]["employment_2016_0"]);
		var projected_p = parseInt(object[index][0]["projected_employment_2026_0"]);
		return [current_p, projected_p];
	}
}