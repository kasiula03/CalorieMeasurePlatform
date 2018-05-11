Template.LoginModal.events({
	'click .close-login': () => {
		Session.set('nav-toggle', '');
	},
	'click .at-signin-link': () => {
		Session.set('signup-form', false);
		Session.set('signin-form', true);
		Session.set('nav-toggle', 'open');
	}
});
