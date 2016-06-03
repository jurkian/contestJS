var $ = require('jquery'),
	Page = require('page'),
	Route = require('./route.js'),
	Popup = require('./popup.js'),
	View = require('./view.js');

// Run the game if all assets are loaded
var init = function() {

	// Settings
	// ...

	// Initialize Popup
	Popup.init({
		popupOverlayEl: document.querySelector('.popup-overlay'),
		popupEl: document.querySelector('.popup'),
		closeEl: document.querySelector('.popup .close'),
		openedClass: 'opened'
	});

	// Routing
	View.init(document.querySelector('section.view'));
	Page.base('/');

	Page('*', Route.init);
	Page('/', Route.intro);
	Page('prizes', Route.prizes);
	Page('rules', Route.rules);
	Page('help', Route.help);
	Page('about', Route.about);
	Page('contact', Route.contact);
	
	// Questions
	Page('question/:id', Route.question);

	// Not found
	Page('*', Route.notFound);
	Page();
};

$(window).on('load', init);