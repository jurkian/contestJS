let View = require('./view.js'),
	Popup = require('./popup.js'),
	Questions = require('./questions.js');

let init = (ctx, next) => {
	next();
};

let intro = () => {
	View.loadTransition('/views/intro.html');
};

let prizes = () => {
	View.loadTransition('/views/prizes.html');
};

let rules = () => {
	View.loadTransition('/views/rules.html');
};

let help = () => {
	View.loadTransition('/views/help.html');
};

let about = () => {
	Popup.showTpl('/views/popup/about.html');
};

let contact = () => {
	Popup.showTpl('/views/popup/contact.html');
};

let thankyou = () => {
	View.loadTransition('/views/intro.html');
	Popup.showTpl('/views/popup/thank-you.html');
	Questions.reset();
};

let question = (ctx, next) => {
	let urlId = parseInt(ctx.params.id, 10);

	Questions.getCurrent(urlId, data => {
		View.renderQuestion(data.template, data, () => {
			Questions.activate(data.type, urlId);
		});
	});
};

let notFound = () => {};

module.exports = {
	init,
	intro,
	prizes,
	rules,
	help,
	about,
	contact,
	thankyou,
	question,
	notFound
};