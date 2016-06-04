var $ = require('jquery'),
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

var close = function() {
	s.popupOverlayEl.removeClass(s.openedClass);
	s.popupEl.removeClass(s.openedClass);
};

var show = function() {

	// Close any open popup before showing new one
	close();

	// Add classes
	s.popupOverlayEl.addClass(s.openedClass);
	s.popupEl.addClass(s.openedClass);
};

var showTpl = function(template) {
	
	// Get template
	View.getTemplate(template, function(html) {
		popupContent.empty().append(html);

		// Popup is ready - show it
		show();
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