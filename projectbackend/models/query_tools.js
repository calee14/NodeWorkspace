module.exports = {
	getDuties: function(object, index) {
		return object[index][0]["duties"];
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