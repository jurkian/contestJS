var View = require('./view.js'),
	Popup = require('./popup.js'),
	Questions = require('./questions.js'),
	Mustache = require('mustache');

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

var question = function(ctx, next) {
	var urlId = parseInt(ctx.params.id, 10);

	if (!isNaN(urlId)) {
		Questions.getCurrent(urlId, function(currentQ) {

			// Single question
			if (currentQ.type === 'question') {

				View.getTemplate('/views/question.mst', function(html) {

					// Prepare Mustache data
					var view = {
					  title: currentQ.title,
					  currentNumber: urlId,
					  totalNumber: currentQ.count,
					  answers: currentQ.answers,
					  isPrevious: currentQ.isPrevious,
					  isNext: currentQ.isNext,
					  previousId: currentQ.previousId,
					  nextId: currentQ.nextId
					};

					var output = Mustache.render(html, view);
					View.render(output);
				});

			} else if (currentQ.type === 'form') {

				// Single form
				View.getTemplate('/views/form.html', function(output) {
					View.render(output);
				});
			}
		});
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