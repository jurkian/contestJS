import Mustache from 'mustache';
import './jquery.oncssanimationend';

let View = {};

// Settings
let s = {
	container: {},
	cache: {}
};

View.init = container => s.container = container;

// Get HTML template
View.getTemplate = (url, callback) => {
	if (s.cache[url]) {
		if (typeof callback === 'function') {
			return callback(s.cache[url]);
		}
	}

	$.get(url, data => {
		s.cache[url] = data;

		if (typeof callback === 'function') {
			callback(data);
		}
	});
};

// Render the view
View.render = html => s.container.empty().append(html);

// Load view
View.load = (view, callback) => {
	View.getTemplate(view, html => {
		View.render(html);

		if (typeof callback === 'function') {
			callback();
		}
	});
};

// Load view with transition
View.loadTransition = (view, customRender, callback) => {

	// Reset animation classes and hide view
	s.container.removeClass('view-in view-out');

	// Hide view and wait for animation to end
	s.container.addClass('view-out');
	s.container.onCSSAnimationEnd(() => {

		// Make it really hidden

		// Do things before showing new view
		View.getTemplate(view, html => {

			// Use the custom function to render view
			if (typeof customRender === 'function') {
				customRender(html);
			} else {
				View.render(html);
			}

			// Start showing new view
			s.container.addClass('view-in');
			s.container.onCSSAnimationEnd(() => {

				s.container.removeClass('view-in view-out');

				// When animation is done, callback
				if (typeof callback === 'function') {
					callback();
				}
			});
		});
	});
};

// Render HTML template using Mustache and view data
View.renderQuestion = (template, view, callback) => {
	View.loadTransition(template, html => {
		let output = Mustache.render(html, view);
		View.render(output);
	}, callback);
};

export default View;