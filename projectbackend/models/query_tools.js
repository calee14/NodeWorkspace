module.exports = {
	getDescription: function(row, description_list) {
		var row_title = row["occupation_group"];
		if(row_title == "Arts_Design_Entertainment_Sports_and_Media") { row_title = "Arts_and_Design"}
		var description;
		for(var i=0;i<description_list.length;i++) {
			if(row_title == description_list[i]["job_title"].replace(/,/g,"").split(' ').join('_')) {
				description = description_list[i]["header"].slice(1, description_list[i]["header"].length-2);
				break;
			}
		}
		return description;
	},
	getDuties: function(object, index) {
		return object[index][0]["duties"].slice(1);
	},
	getHowToBecome: function(object, index) {
		var new_object = object[index][0];
		var count = 0;
		var steps = []
		var number = 0;
		var key_name = "";
		for(var key in new_object) {
			if(count < 2) {count += 1; continue;}
			if(new_object.hasOwnProperty(key)) {
				var howtobecome = new_object[key];
				if(howtobecome == null) {continue};
				key_name = howtobecome[0];
				if(howtobecome[0] != "Important Qualities") {
					howtobecome = howtobecome.slice(1);
					var index = 0;
					var howtobecome_temp = []
					while(true) {
						var firstElement = howtobecome[index];
						if(index == howtobecome.length) {
							break;
						} else if(firstElement.trim().slice(-1) == ".") {
							howtobecome_temp.push(firstElement);
						} else if(firstElement.trim().slice(-1) != ".") {
							while(firstElement.trim().slice(-1) != ".") {
								index += 1;
								firstElement += (" " + howtobecome[index]);
							}
							howtobecome_temp.push(firstElement);
						}
						index += 1;
					}
					howtobecome = howtobecome_temp;
					for(var i=0;i<howtobecome.length;i++) {
						number += 1;
						var education = {
							title: key_name,
							text: howtobecome[i],
							number: number
						};
						steps.push(education);
					}
				}
				// return steps;
			}
		}
		return steps;
	},
	getSkills: function(object, index) {
		var new_object = object[index][0];
		var count = 0;
		for(var key in new_object) {
			if(count < 2) {count += 1; continue;}
			if(new_object.hasOwnProperty(key)) {
				var howtobecome = new_object[key];
				if(howtobecome == null) {continue;}
				// console.log(howtobecome[0]);
				if(howtobecome[0] == "Important Qualities") {
					howtobecome = howtobecome.slice(1);
					var skills = []
					// console.log(howtobecome);
					var new_a = howtobecome;
					var i = new_a.length;
					while(i--) {
						if(new_a[i].length == 1 && new_a[i] == ".") {
							new_a[i-1] += new_a[i];
							new_a.splice(i, 1);
						}
					}
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
	getEmployment: function(object, index) {
		var current_e = parseInt(object[index][0]["employment_2016_0"].replace(/,/g, ""));
		var projected_e = parseInt(object[index][0]["projected_employment_2026_0"].replace(/,/g, ""));
		return [current_e, projected_e];
	},
	getEmploymentPercent: function(object, index) {
		var current_p = parseInt(object[index][0]["employment_2016_0"]);
		var projected_p = parseInt(object[index][0]["projected_employment_2026_0"]);
		return [current_p, projected_p];
	}
}