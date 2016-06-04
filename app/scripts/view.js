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
	s.container.removeClass('view-out visuallyhidden');

	// Hide view and wait for transition to end
	s.container.addClass('view-out');
	s.container.onCSSTransitionEnd(function() {

		// Make it really hidden
		s.container.addClass('visuallyhidden');

		// Do things before showing new view
		getTemplate(view, function(html) {
			render(html);

			// Before new view is shown
			if (typeof before === 'function') {
				before();
			}

			// Start showing new view
			s.container.removeClass('view-out visuallyhidden');
			s.container.onCSSTransitionEnd(function() {

				// When transition is done, callback
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