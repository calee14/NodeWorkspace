module.exports = {
	getDuties: function(object, index) {
		return object[index][0]["duties"].slice(1);
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
				// console.log(howtobecome[0]);
				if(howtobecome[0] == "Important Qualities") {
					howtobecome = howtobecome.slice(1);
					var skills = []
					// console.log(howtobecome);
					var new_a = howtobecome.filter(function(i){return i.length > 1})
					var index = 0;
					var completed = 0;
					var skill_holder = "";
					while(true) {
						var firstElement = new_a[index];
						if(index == new_a.length) {
							break;
						} else if(firstElement.trim().slice(-1) == ".") {
							skill_holder += (" " + firstElement);
							// skills.push(firstElement);
							completed += 1;
						} else if(firstElement.trim().slice(-1) != ".") {
							while(firstElement.trim().slice(-1) != ".") {
								index += 1;
								firstElement += (" " + new_a[index]);
							}
							// skills.push(firstElement);
							skill_holder += (" " + firstElement);
							completed += 1;
						}
						if(completed == 2) {
							skills.push(skill_holder);
							skill_holder = "";
							completed = 0;
						}
						index += 1;
					}
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