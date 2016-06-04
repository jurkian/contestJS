var $ = require('jquery');

// If Local Storage is empty, get questions from API
// Store them in LS to avoid unnecessary HTTP calls
var getAll = function(callback) {

	if (!load()) {
		$.getJSON('/api.json', function(data) {
			save(data);

			if (typeof callback === 'function') {
				callback(data);
			}
		});

	} else {
		if (typeof callback === 'function') {
			callback(load());
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

// Save questions as JSON
var save = function(questions) {
	localStorage.setItem('contest_questions', JSON.stringify(questions));
};

// Load questions as JSON
var load = function() {
	return JSON.parse(localStorage.getItem('contest_questions'));
};

module.exports = {
	getCurrent: getCurrent
};