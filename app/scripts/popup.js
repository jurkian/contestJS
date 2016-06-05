var $ = require('jquery'),
	onCSSAnimationEnd = require('./jquery.oncssanimationend.js'),
	View = require('./view.js');

// Settings
var s = {
	popupOverlayEl: $('.popup-overlay'),
	popupEl: $('.popup'),
	closeEl: $('.popup').find('.close'),
	openedClass: 'opened'
};

// Local variables
var popupBtn = {},
	popupContent = {};

var close = function(callback) {

	// Remove opened class and wait for transition to end
	s.popupOverlayEl.removeClass(s.openedClass);
	s.popupEl.removeClass(s.openedClass);

	// Then: visually hide it
	s.popupOverlayEl.onCSSTransitionEnd(function() {
		s.popupOverlayEl.addClass('visuallyhidden');
		s.popupEl.addClass('visuallyhidden');

		popupContent.empty();

		// Callback for transition
		if (typeof callback === 'function') {
			callback();
		}
	});

	// Callback for no transition
	if (typeof callback === 'function') {
		callback();
	}
};

var show = function() {

	s.popupOverlayEl.removeClass('visuallyhidden');
	s.popupEl.removeClass('visuallyhidden');

	// Add classes
	s.popupOverlayEl.addClass(s.openedClass);
	s.popupEl.addClass(s.openedClass);

};

var showTpl = function(template) {

	// Close any open popups before showing new one
	close(function() {
		// Get template
		View.getTemplate(template, function(html) {
			popupContent.append(html);

			// Popup is ready - show it
			show();
		});
	});
};

var init = function(config) {
	s = config;

	// Set local vars
	popupBtn = s.popupEl.find('.close-btn') || null;
	popupContent = s.popupEl.find('.popup-content') || null;

	// Handle popup close events
	// On button click
	if (popupBtn !== null) {
		popupBtn.on('click', close);
	}

	// On outside popup click
	s.popupOverlayEl.on('click', close);

	// On "x" click
	s.closeEl.on('click', close);

	// But do nothing when clicked inside popup
	s.popupEl.on('click', function(e) {
		e.stopPropagation();
	});
};

module.exports = {
	init: init,
	show: show,
	showTpl: showTpl,
	close: close
};