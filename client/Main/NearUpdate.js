Session.setDefault('currentTasks', []);
Session.setDefault('soonTasks', []);
Session.setDefault('finishedTasks', []);

Template.NearUpdate.helpers({
	trelloSoonTasks: function () {
		Meteor.call('trelloSoonTasks', (error, results) => {
			Session.set('soonTasks', results);
		});
		return Session.get('soonTasks');
	},
	trelloWorkingTasks: function () {
		Meteor.call('trelloCurrentTasks', (error, results) => {
			Session.set('currentTasks', results);
		});
		return Session.get('currentTasks');
	},
	trelloFinishedTasks: function () {
		Meteor.call('trelloFinishedTasks', (error, results) => {
			Session.set('finishedTasks', results);
		});
		return Session.get('finishedTasks');
	}
});
