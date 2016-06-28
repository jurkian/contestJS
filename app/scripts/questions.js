let $ = require('jquery'),
	Validation = require('./validation.js'),
	Tools = require('./tools.js');

// If Local Storage is empty, get questions from API
// Store them in LS to avoid unnecessary HTTP calls
let getAll = callback => {

	let questions = Tools.loadLS('contest_questions');

	if (!questions) {
		$.getJSON('/api.json', data => {
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
let getCurrent = (urlId, callback) => {

	if (!isNaN(urlId)) {
		getAll(data => {

			// Questions in the address bar should start from 1
			// But in API they start from 0
			let currentQuestion = data.forms[urlId - 1],
				count = data.forms.length,
				answers = currentQuestion.answers || false,
				formFields = currentQuestion.fields || false,
				template = '';

			// Prepare Mustache view data
			let view = {
				template: '',
				type: currentQuestion.type,
				title: currentQuestion.title,
				currentNumber: urlId,
				totalNumber: count,
				isPrevious: false,
				isNext: true,
				previousId: 0,
				nextId: 1,
			};

			// Determine the view template
			if (view.type === 'question') {
				view.template = '/views/question.mst';
			} else if (view.type === 'form') {
				view.template = '/views/form.mst';
			}

			// Prepare answers
			// Add index to each answer
			if (answers) {
				let answersArr = [];

				answers.forEach((answer, index) => {
					answersArr.push({
						'index': parseInt(index, 10) + 1,
						'title': answer
					});
				});

				view.answers = answersArr;
			}

			// Prepare form fields
			if (formFields) {
				view.isName = formFields.name;
				view.isLastName = formFields.last_name;
				view.isEmail = formFields.email;
				view.isPhone = formFields.phone;
				view.isOpenQuestion = formFields.open_question;
			}

			// Prepare "previous" and "next" buttons and their IDs

			// Don't show "go back" if there is no previous question
			if (urlId - 1 <= 0) {
				view.isPrevious = false;
			} else {
				view.isPrevious = true;
				view.previousId = urlId - 1;
			}

			// Don't show "go next" if it's more than questions count
			if (urlId + 1 > count) {
				view.isNext = false;
			} else {
				view.isNext = true;
				view.nextId = urlId + 1;
			}

			if (typeof callback === 'function') {
				callback(view);
			}
		});
	}

};

// Question view actions
let handleQuestionView = (contestAnswers, questionNumber) => {
	
	// Highlight selected answer
	let answerNumber = contestAnswers[questionNumber];

	if (contestAnswers && answerNumber) {
		$('.question-box').find('li[data-answer="' + answerNumber + '"]')
			.addClass('active');
	}

	// Highlight clicked answer
	$('.question-box').find('.answers-list').on('click', 'li', function() {
		$(this).closest('ul').find('li').removeClass('active');
		$(this).addClass('active');

		let answerId = parseInt($(this).data('answer'), 10);

		// Save new answer to current question
		contestAnswers[questionNumber] = answerId;
		Tools.saveLS('contest_answers', contestAnswers);
	});	
};

// Form view actions
let handleFormView = contestAnswers => {

	let formFields = contestAnswers.fields;

	// Autocomplete form fields
	if (formFields) {

		// Form field name == API field name
		$.each(formFields, (index, val) => {
			$('.question-box').find('[name="' + index + '"]').val(formFields[index]);
		});

	} else {
		contestAnswers.fields = {};
	}

	// Activate validation
	Validation.activate($('.question-box').find('form'));

	// Save the field when focus is lost == blur
	$('.question-box').find('input, textarea').on('blur', function() {
		let fieldName = $(this).attr('name');

		contestAnswers.fields[fieldName] = $(this).val();
		Tools.saveLS('contest_answers', contestAnswers);
	});
};

// Activate question views
// make answers clickable, enable autocomplete and save
let activate = (type, questionNumber) => {

	// Load the answers
	let contestAnswers = Tools.loadLS('contest_answers') || {};

	if (type === 'question') {
		handleQuestionView(contestAnswers, questionNumber);
	} else if (type === 'form') {
		handleFormView(contestAnswers);
	}
};

// Remove all questions and answers data from LS
let reset = () => {
	localStorage.setItem('contest_answers', '');
	localStorage.setItem('contest_questions', '');
};

module.exports = {
	getCurrent,
	activate,
	reset
};