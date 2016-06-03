var View = require('./view.js');

// Settings
var s = {
	popupOverlayEl: document.querySelector('.popup-overlay'),
	popupEl: document.querySelector('.popup'),
	closeEl: document.querySelector('.popup .close'),
	openedClass: 'opened'
};

// Local variables
var popupBtn = {},
	popupContent = {};

var close = function() {
	s.popupOverlayEl.classList.remove(s.openedClass);
	s.popupEl.classList.remove(s.openedClass);
};

var show = function() {

	// Close any open popup before showing new one
	close();

	// Add classes
	s.popupOverlayEl.classList.add(s.openedClass);
	s.popupEl.classList.add(s.openedClass);
};

var showTpl = function(template) {
	
	// Get template
	View.getTemplate(template, function(html) {
		popupContent.innerHTML = '';
		popupContent.insertAdjacentHTML('beforeend', html);

		// Popup is ready - show it
		show();
	});
};

var init = function(config) {
	s = config;

	// Set local vars
	popupBtn = s.popupEl.querySelector('.close-btn') || null;
	popupContent = s.popupEl.querySelector('.popup-content') || null;

	// Handle popup close events
	// On button click
	if (popupBtn !== null) {
		popupBtn.addEventListener('click', close, false);
	}

	// On outside popup click
	s.popupOverlayEl.addEventListener('click', close, false);

	// On "x" click
	s.closeEl.addEventListener('click', close, false);

	// But do nothing when clicked inside popup
	s.popupEl.addEventListener('click', function(e) {
		e.stopPropagation();
	}, false);
};

module.exports = {
	init: init,
	show: show,
	showTpl: showTpl,
	close: close
};