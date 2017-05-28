import Page from 'page';
import Route from './lib/route';
import Popup from './lib/popup';
import View from './lib/view';
import Tools from './lib/tools';

// Run the game if all assets are loaded
$(() => {
	// Settings
	// ...

	// Initialize Popup
	Popup.init({
		popupOverlayEl: $('.popup-overlay'),
		popupEl: $('.popup'),
		closeEl: $('.popup').find('.close'),
		openedClass: 'opened'
	});

	// Check if user's browser is up to date
	if (!Tools.isBrowserSupported()) {
		Popup.showTpl('/views/popup/new-browser.html');
	}

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
});