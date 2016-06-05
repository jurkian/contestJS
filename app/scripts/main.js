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
		popupOverlayEl: $('.popup-overlay'),
		popupEl: $('.popup'),
		closeEl: $('.popup').find('.close'),
		openedClass: 'opened'
	});

	// Routing
	View.init($('section.view'));
	Page.base('/');

	Page('*', Route.init);
	Page('/', Route.intro);
	Page('prizes', Route.prizes);
	Page('rules', Route.rules);
	Page('help', Route.help);
	Page('about', Route.about);
	Page('contact', Route.contact);
	
	// Questions
	Page('thankyou', Route.thankyou);
	Page('question/:id', Route.question);

	// Not found
	Page('*', Route.notFound);
	Page();
};

$(window).on('load', init);