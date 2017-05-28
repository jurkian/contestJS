import View from './view';
import './jquery.oncssanimationend';

let Popup = {};

// Settings
let s = {
	popupOverlayEl: $('.popup-overlay'),
	popupEl: $('.popup'),
	closeEl: $('.popup').find('.close'),
	openedClass: 'opened'
};

// Local variables
let popupBtn = {},
	popupContent = {};

Popup.close = callback => {

	// Remove opened class and wait for transition to end
	s.popupOverlayEl.removeClass(s.openedClass);
	s.popupEl.removeClass(s.openedClass);

	// Then: visually hide it
	s.popupOverlayEl.onCSSTransitionEnd(() => {
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

Popup.show = () => {

	s.popupOverlayEl.removeClass('visuallyhidden');
	s.popupEl.removeClass('visuallyhidden');

	// Add classes
	s.popupOverlayEl.addClass(s.openedClass);
	s.popupEl.addClass(s.openedClass);

};

Popup.showTpl = template => {

	// Close any open popups before showing new one
	close(() => {
		// Get template
		View.getTemplate(template, html => {
			popupContent.append(html);

			// Popup is ready - show it
			show();
		});
	});
};

Popup.init = config => {
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
	s.popupEl.on('click', e => {
		e.stopPropagation();
	});
};

export default Popup;