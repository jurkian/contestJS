var $ = require('jquery'),
	onCSSAnimationEnd = require('./jquery.oncssanimationend.js'),
	Mustache = require('mustache');

// Settings
var s = {
	container: {},
	cache: {}
};

var init = function(container) {
	s.container = container;
};

// Get HTML template
var getTemplate = function(url, callback) {
	if (s.cache[url]) {
		if (typeof callback === 'function') {
			return callback(s.cache[url]);
		}
	}

	$.get(url, function(data) {
		s.cache[url] = data;

		if (typeof callback === 'function') {
			callback(data);
		}
	});
};

// Render the view
var render = function(html) {
	s.container.empty().append(html);
};

// Load view
var load = function(view, callback) {
	getTemplate(view, function(html) {
		render(html);

		if (typeof callback === 'function') {
			callback();
		}
	});
};

// Load view with transition
var loadTransition = function(view, customRender, callback) {

	// Reset animation classes and hide view
	s.container.removeClass('view-in view-out');

	// Hide view and wait for animation to end
	s.container.addClass('view-out');
	s.container.onCSSAnimationEnd(function() {

		// Make it really hidden

		// Do things before showing new view
		getTemplate(view, function(html) {

			// Use the custom function to render view
			if (typeof customRender === 'function') {
				customRender(html);
			} else {
				render(html);
			}

			// Start showing new view
			s.container.addClass('view-in');
			s.container.onCSSAnimationEnd(function() {

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
var renderQuestion = function(template, view, callback) {
	loadTransition(template, function(html) {
		var output = Mustache.render(html, view);
		render(output);
	}, callback);
};

module.exports = {
	init: init,
	getTemplate: getTemplate,
	load: load,
	render: render,
	renderQuestion: renderQuestion,
	loadTransition: loadTransition
};