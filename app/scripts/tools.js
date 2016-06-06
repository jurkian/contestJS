var Modernizr = require('modernizr');

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

// Detect features using Modernizr
var isBrowserSupported = function() {
	return Modernizr.hashchange && Modernizr.history && Modernizr.inputtypes &&
		Modernizr.json && Modernizr.cssanimations && Modernizr.flexbox &&
		Modernizr.fontface && Modernizr.mediaqueries && Modernizr.csstransforms &&
		Modernizr.csstransitions && Modernizr.localstorage;
};

module.exports = {
	saveLS: saveLS,
	loadLS: loadLS,
	isBrowserSupported: isBrowserSupported
};