let Modernizr = require('modernizr');

// Save as JSON
let saveLS = (itemName, value) => {
	localStorage.setItem(itemName, JSON.stringify(value));
};

// Load as JSON
let loadLS = itemName => {
	let data = localStorage.getItem(itemName);

	if (data) {
		return JSON.parse(data);
	} else {
		return data;
	}
};

// Detect features using Modernizr
let isBrowserSupported = () => {
	return Modernizr.hashchange && Modernizr.history && Modernizr.inputtypes &&
		Modernizr.json && Modernizr.cssanimations && Modernizr.flexbox &&
		Modernizr.fontface && Modernizr.mediaqueries && Modernizr.csstransforms &&
		Modernizr.csstransitions && Modernizr.localstorage;
};

module.exports = {
	saveLS,
	loadLS,
	isBrowserSupported
};