var $ = require('jquery'),
	onCSSAnimationEnd = require('./jquery.oncssanimationend.js');

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
var loadTransition = function(view, before, callback) {

	// Reset transition classes and hide view
	s.container.removeClass('view-out view-in');

	// Hide view
	s.container.addClass('view-out');
	s.container.onCSSAnimationEnd(function() {

		// Do things before showing new view
		getTemplate(view, function(html) {
			render(html);

			// Before new view - callback
			if (typeof before === 'function') {
				before();
			}

			// Start showing new view
			s.container.addClass('view-in');
			s.container.onCSSAnimationEnd(function() {
				s.container.removeClass('view-out view-in');

				if (typeof callback === 'function') {
					callback();
				}
			});
		});
	});
};

module.exports = {
	init: init,
	getTemplate: getTemplate,
	load: load,
	render: render,
	loadTransition: loadTransition
};