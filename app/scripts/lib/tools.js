import Modernizr from './modernizr';

let Tools = {};

// Save as JSON
Tools.saveLS = (itemName, value) => {
	localStorage.setItem(itemName, JSON.stringify(value));
};

// Load as JSON
Tools.loadLS = itemName => {
	let data = localStorage.getItem(itemName);

	if (data) {
		return JSON.parse(data);
	} else {
		return data;
	}
};

// Detect features using Modernizr
Tools.isBrowserSupported = () => {
	return Modernizr.hashchange && Modernizr.history && Modernizr.inputtypes &&
		Modernizr.json && Modernizr.cssanimations && Modernizr.flexbox &&
		Modernizr.fontface && Modernizr.mediaqueries && Modernizr.csstransforms &&
		Modernizr.csstransitions && Modernizr.localstorage;
};

export default Tools;