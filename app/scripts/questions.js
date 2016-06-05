var $ = require('jquery');

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
	return JSON.parse(localStorage.getItem(itemName));
};

// Activate question = make answers clickable, load and save them
var activate = function(type, questionNumber) {
	if (type === 'question') {

		// Load the answers and highlight selected
		var contestAnswers = load('contest_answers') || {},
			answerNumber = contestAnswers[questionNumber];

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

	} else if (type === 'form') {

	}
};

module.exports = {
	getCurrent: getCurrent,
	activate: activate
};