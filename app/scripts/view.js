let $ = require('jquery'),
	Mustache = require('mustache');

require('./jquery.oncssanimationend.js');

// Settings
let s = {
	container: {},
	cache: {}
};

let init = container => s.container = container;

// Get HTML template
let getTemplate = (url, callback) => {
	if (s.cache[url]) {
		if (typeof callback === 'function') {
			return callback(s.cache[url]);
		}
	}

	$.get(url, data => {
		s.cache[url] = data;

		if (typeof callback === 'function') {
			callback(data);
		}
	});
};

// Render the view
let render = html => s.container.empty().append(html);

// Load view
let load = (view, callback) => {
	getTemplate(view, html => {
		render(html);

		if (typeof callback === 'function') {
			callback();
		}
	});
};

// Load view with transition
let loadTransition = (view, customRender, callback) => {

	// Reset animation classes and hide view
	s.container.removeClass('view-in view-out');

	// Hide view and wait for animation to end
	s.container.addClass('view-out');
	s.container.onCSSAnimationEnd(() => {

		// Make it really hidden

		// Do things before showing new view
		getTemplate(view, html => {

			// Use the custom function to render view
			if (typeof customRender === 'function') {
				customRender(html);
			} else {
				render(html);
			}

			// Start showing new view
			s.container.addClass('view-in');
			s.container.onCSSAnimationEnd(() => {

				s.container.removeClass('view-in view-out');

				// When animation is done, callback
				if (typeof callback === 'function') {
					callback();
				}
			});
		});
	});
};

// Render HTML template using Mustache and view data
let renderQuestion = (template, view, callback) => {
	loadTransition(template, html => {
		let output = Mustache.render(html, view);
		render(output);
	}, callback);
};

module.exports = {
	init,
	getTemplate,
	load,
	render,
	renderQuestion,
	loadTransition
};