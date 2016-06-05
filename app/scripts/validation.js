var $ = require('jquery'),
	jqueryValidation = require('jquery-validation'),
	Page = require('page'),
	Popup = require('./popup.js'),
	Tools = require('./tools.js');

// Validate answers
var isAnswersValid = function() {
	var questions = Tools.loadLS('contest_questions'),
		answers = Tools.loadLS('contest_answers');

	// Assume that questions go first and the last one is form
	// isAnswersValid goes only if form is correct
	// Exclude it when checking length
	var questionsLength = Object.keys(questions.forms).length - 1,
		answersLength = Object.keys(answers).length - 1;

	if (answersLength < questionsLength) {
		Popup.showTpl('/views/popup/questions-error.html');
		Page('/question/1');

		return false;
	} else {
		return true;
	}
};

// Assume that form is valid
// Now check the answers
var handleSubmit = function(form) {
	if (isAnswersValid() === true) {
		Page('/thankyou');
	}
};

// Questions and form validation
var activate = function(form) {
	$(form).validate({
		rules: {
			name: {
				required: true,
				minlength: 2
			},
			last_name: {
				required: true,
				minlength: 2
			},
			email: {
				required: true,
				email: true,
				minlength: 6
			},
			open_question: {
				required: true,
				minlength: 15,
				maxlength: 500
			}
		},
		messages: {
			name: {
				required: "Please write your name",
				minlength: "Name should be at least 2 characters"
			},
			last_name: {
				required: "Please write your last name",
				minlength: "Last name should be at least 2 characters"
			},
			email: {
				required: "Please write your email",
				minlength: "Email should be at least 6 characters",
				email: "You email doesn't seem correct"
			},
			open_question: {
				required: "Please write your answer",
				minlength: "Answer should be at least 15 characters",
				maxlength: "Answer should be a maximum 500 characters"
			}
		},
		errorLabelContainer: $('.validation-errors'),
		errorElement: "p",
		submitHandler: function(form) {
			handleSubmit(form);
		}
	});
};

module.exports = {
	activate: activate
};