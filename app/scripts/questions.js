var $ = require('jquery'),
	Validation = require('./validation.js'),
	Tools = require('./tools.js');

// If Local Storage is empty, get questions from API
// Store them in LS to avoid unnecessary HTTP calls
var getAll = function(callback) {

	var questions = Tools.loadLS('contest_questions');

	if (!questions) {
		$.getJSON('/api.json', function(data) {
			Tools.saveLS('contest_questions', data);

			if (typeof callback === 'function') {
				callback(data);
			}
		});

	} else {
		if (typeof callback === 'function') {
			callback(questions);
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
		Tools.saveLS('contest_answers', contestAnswers);
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
	Validation.activate($('.question-box').find('form'));

	// Save the field when focus is lost == blur
	$('.question-box').find('input, textarea').on('blur', function() {
		var fieldName = $(this).attr('name');

		contestAnswers.fields[fieldName] = $(this).val();
		Tools.saveLS('contest_answers', contestAnswers);
	});
};

// Activate question views
// make answers clickable, enable autocomplete and save
var activate = function(type, questionNumber) {

	// Load the answers
	var contestAnswers = Tools.loadLS('contest_answers') || {};

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