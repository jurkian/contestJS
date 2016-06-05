// Save as JSON
var saveLS = function(itemName, value) {
	localStorage.setItem(itemName, JSON.stringify(value));
};

// Load as JSON
var loadLS = function(itemName) {
	var data = localStorage.getItem(itemName);

	if (data) {
		return JSON.parse(data);
	} else {
		return data;
	}
};

module.exports = {
	saveLS: saveLS,
	loadLS: loadLS
};