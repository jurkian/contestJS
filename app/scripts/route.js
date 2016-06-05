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

var submit = function() {
	Popup.showTpl('/views/popup/thankyou.html');
};

var question = function(ctx, next) {
	var urlId = parseInt(ctx.params.id, 10);

	if (!isNaN(urlId)) {
		Questions.getCurrent(urlId, function(currentQ) {

			// Form fields
			var formFields = {};

			if (currentQ.fields) {
				formFields = currentQ.fields;
			}

			// Add index to each answer
			var answers = currentQ.answers,
				answersArr = [];

			for (var i = 0, len = answers.length; i < len; i++) {
				answersArr.push({
					'index': parseInt(i, 10) + 1,
					'title': answers[i]
				});
			}

			// Prepare Mustache data
			var view = {
			  title: currentQ.title,
			  currentNumber: urlId,
			  totalNumber: currentQ.count,
			  answers: answersArr,
			  isPrevious: currentQ.isPrevious,
			  isNext: currentQ.isNext,
			  previousId: currentQ.previousId,
			  nextId: currentQ.nextId,
			  isName: formFields.name,
			  isLastName: formFields.last_name,
			  isEmail: formFields.email,
			  isPhone: formFields.phone,
			  isOpenQuestion: formFields.open_question
			};

			View.renderQuestion(currentQ.type, view, function() {
				Questions.activate(currentQ.type, urlId);
			});
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
	submit: submit,
	question: question,
	notFound: notFound
};