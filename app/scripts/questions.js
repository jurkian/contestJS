var $ = require('jquery'),
	jqueryValidation = require('jquery-validation'),
	Page = require('page'),
	Popup = require('./popup.js');

// If Local Storage is empty, get questions from API
// Store them in LS to avoid unnecessary HTTP calls
var getAll = function(callback) {

	if (!load('contest_questions')) {
		$.getJSON('/api.json', function(data) {
			save('contest_questions', data);

			if (typeof callback === 'function') {
				callback(data);
			}
		});

	} else {
		if (typeof callback === 'function') {
			callback(load('contest_questions'));
		}
	}
};

// Make sure that questions are loaded in LS
// And return the current question's data
var getCurrent = function(urlId, callback) {
	getAll(function(data) {

		// Questions in the address bar should start from 1
		// But in API they start from 0
		var currentQuestion = data.forms[urlId - 1],
			count = data.forms.length,
			isPrevious = false,
			isNext = true,
			previousId = 0,
			nextId = 1;

		// Don't show "go back" if there is no previous question
		if (urlId - 1 <= 0) {
			isPrevious = false;
		} else {
			isPrevious = true;
			previousId = urlId - 1;
		}

		// Don't show "go next" if it's more than questions count
		if (urlId + 1 > count) {
			isNext = false;
		} else {
			isNext = true;
			nextId = urlId + 1;
		}

		var cbData = {
			count: count,
			answers: currentQuestion.answers || false,
			fields: currentQuestion.fields || false,
			title: currentQuestion.title,
			type: currentQuestion.type,
			isPrevious: isPrevious,
			isNext: isNext,
			previousId: previousId,
			nextId: nextId
		};

		if (typeof callback === 'function') {
			callback(cbData);
		}

	});
};

// Save as JSON
var save = function(itemName, value) {
	localStorage.setItem(itemName, JSON.stringify(value));
};

// Load as JSON
var load = function(itemName) {
	var data = localStorage.getItem(itemName);

	if (data) {
		return JSON.parse(data);
	} else {
		return data;
	}
};

// Validate answers
var isAnswersValid = function() {
	var questions = load('contest_questions'),
		answers = load('contest_answers');

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
var activateValidation = function(form) {
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

// Question view actions
var handleQuestionView = function(contestAnswers, questionNumber) {
	
	// Highlight selected answer
	var answerNumber = contestAnswers[questionNumber];

	if (contestAnswers && answerNumber) {
		$('.question-box').find('li[data-answer="' + answerNumber + '"]')
			.addClass('active');
	}

	// Highlight clicked answer
	$('.question-box').find('.answers-list').on('click', 'li', function() {
		$(this).closest('ul').find('li').removeClass('active');
		$(this).addClass('active');

		var answerId = parseInt($(this).data('answer'), 10);

		// Save new answer to current question
		contestAnswers[questionNumber] = answerId;
		save('contest_answers', contestAnswers);
	});	
};

// Form view actions
var handleFormView = function(contestAnswers) {

	var formFields = contestAnswers.fields;

	// Autocomplete form fields
	if (formFields) {

		// Form field name == API field name
		$.each(formFields, function(index, val) {
			$('.question-box').find('[name="' + index + '"]').val(formFields[index]);
		});

	} else {
		contestAnswers.fields = {};
	}

	// Activate validation
	activateValidation($('.question-box').find('form'));

	// Save the field when focus is lost == blur
	$('.question-box').find('input, textarea').on('blur', function() {
		var fieldName = $(this).attr('name');

		contestAnswers.fields[fieldName] = $(this).val();
		save('contest_answers', contestAnswers);
	});
};

// Activate question views
// make answers clickable, enable autocomplete and save
var activate = function(type, questionNumber) {

	// Load the answers
	var contestAnswers = load('contest_answers') || {};

	if (type === 'question') {
		handleQuestionView(contestAnswers, questionNumber);
	} else if (type === 'form') {
		handleFormView(contestAnswers);
	}
};

// Remove all questions and answers data from LS
var reset = function() {
	localStorage.setItem('contest_answers', '');
	localStorage.setItem('contest_questions', '');
};

module.exports = {
	getCurrent: getCurrent,
	activate: activate,
	reset: reset
};