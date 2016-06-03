var $ = require('jquery'),
	Page = require('page'),
	View = require('./view.js');

// Run the game if all assets are loaded
var init = function() {

	// Settings
	// ...

	// Routing
	View.init(document.querySelector('section.view'));
	Page.base('/');

	Page('/', function() {
		View.load('views/intro.html');
	});

	Page('prizes', function() {
		View.load('views/prizes.html');
	});

	Page('rules', function() {
		View.load('views/rules.html');
	});

	Page('help', function() {
		View.load('views/help.html');
	});

	Page('about', function() {
		View.load('views/about.html');
	});

	Page('contact', function() {
		View.load('views/contact.html');
	});

	// Questions
	Page('question/:id', function(ctx, next) {
		var id = ctx.params.id;
	});

	// Not found
	Page('*', function() {});
	Page();
};

$(window).on('load', init);