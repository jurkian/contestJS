var View = require('./view.js'),
	Popup = require('./popup.js');

var init = function(ctx, next) {
	next();
};

var intro = function() {
	View.load('/views/intro.html');
};

var prizes = function() {
	View.load('/views/prizes.html');
};

var rules = function() {
	View.load('/views/rules.html');
};

var help = function() {
	View.load('/views/help.html');
};

var about = function(ctx, next) {
	Popup.showTpl('/views/popup/about.html');
};

var contact = function(ctx, next) {
	Popup.showTpl('/views/popup/contact.html');
};

var question = function(ctx, next) {
	var id = ctx.params.id;

	if (!isNaN(parseInt(id, 10))) {
		View.load('/views/question.html');
	} else if (id === 'final') {
		View.load('/views/form.html');
	}
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
	question: question,
	notFound: notFound
};