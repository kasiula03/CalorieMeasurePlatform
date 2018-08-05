Session.setDefault("emailValid", false);
Session.setDefault("displayInvalidEmail", false);

Template.ContactForm.helpers({
	displayInvalidEmailMsg: function() {
		return Session.get("displayInvalidEmail");
	}
});

Template.ContactForm.events({
	'submit #send-email': function (event, Template) {
		event.preventDefault();
		if(Session.get("emailValid")) {
			var userEmail = event.target.userEmail.value;
			var username = event.target.userName.value;
			var msgType = event.target.msgType.value;
			var msg = event.target.msgText.value;

			Meteor.call(
				'sendEmail',
				'<knalepka1@gmail.com>',
				userEmail,
				msgType,
				msg + "\nWysłane z Calorie Measure Platform od użytkownika o nicku " + username + " i adresie email " + userEmail
				);
			event.target.userEmail.value = "";
			event.target.userName.value = "";
			event.target.msgText.value = "";
			Session.set("displayInvalidEmail", false);
		} else {
			Session.set("displayInvalidEmail", true);
		}
	},
	'keyup [name="userEmail"]': function (event, Template) {
		var email = event.target.value.trim();
		var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
		Session.set("emailValid", re.test(String(email).toLowerCase()));
	}
});