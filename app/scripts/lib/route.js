import View from './view';
import Popup from './popup';
import Questions from './questions';

let Route = {};

Route.init = (ctx, next) => {
	next();
};

Route.intro = () => {
	View.loadTransition('/views/intro.html');
};

Route.prizes = () => {
	View.loadTransition('/views/prizes.html');
};

Route.rules = () => {
	View.loadTransition('/views/rules.html');
};

Route.help = () => {
	View.loadTransition('/views/help.html');
};

Route.about = () => {
	Popup.showTpl('/views/popup/about.html');
};

Route.contact = () => {
	Popup.showTpl('/views/popup/contact.html');
};

Route.thankyou = () => {
	View.loadTransition('/views/intro.html');
	Popup.showTpl('/views/popup/thank-you.html');
	Questions.reset();
};

Route.question = (ctx, next) => {
	let urlId = parseInt(ctx.params.id, 10);

	Questions.getCurrent(urlId, data => {
		View.renderQuestion(data.template, data, () => {
			Questions.activate(data.type, urlId);
		});
	});
};

Route.notFound = () => {};

export default Route;