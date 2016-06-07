var View = require('./view.js'),
	Popup = require('./popup.js'),
	Questions = require('./questions.js');

var init = function(ctx, next) {
	next();
};

var intro = function() {
	View.loadTransition('/views/intro.html');
};

var prizes = function() {
	View.loadTransition('/views/prizes.html');
};

var rules = function() {
	View.loadTransition('/views/rules.html');
};

var help = function() {
	View.loadTransition('/views/help.html');
};

var about = function() {
	Popup.showTpl('/views/popup/about.html');
};

var contact = function() {
	Popup.showTpl('/views/popup/contact.html');
};

var thankyou = function() {
	View.loadTransition('/views/intro.html');
	Popup.showTpl('/views/popup/thank-you.html');
	Questions.reset();
};

var question = function(ctx, next) {
	var urlId = parseInt(ctx.params.id, 10);

	Questions.getCurrent(urlId, function(data) {
		View.renderQuestion(data.template, data, function() {
			Questions.activate(data.type, urlId);
		});
	});
};

var notFound = function() {};

module.exports = {
	init: init,
	intro: intro,
	prizes: prizes,
	rules: rules,
	help: help,
	about: about,
	contact: contact,
	thankyou: thankyou,
	question: question,
	notFound: notFound
};