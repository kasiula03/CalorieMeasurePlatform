var key = Assets.getText("TrelloKey.txt");
var token = Assets.getText("TrelloToken.txt");
var keyAndTokenParams = "key=" + key +  "&token=" + token;

Meteor.methods({
	trelloSoonTasks: function() {
		return findTasksByListName("Niedlugo");
	},
	trelloCurrentTasks: function() {
		return findTasksByListName("W trakcie");
	},
	trelloFinishedTasks: function() {
		return findTasksByListName("Zrobione");
	}
});

findTasksByListName = function(name) {
	return new Promise(function(resolve) {
		HTTP.call("GET", 'https://api.trello.com/1/boards/t17C3Ilr/lists?' + keyAndTokenParams, {
		},function(error, result) {
			if (!error) {
				var currentWorkingTasks = result.data.find(list => list.name == name);
				resolve(currentWorkingTasks);
			} else {
				console.error(error);
			}
		});
	}).then(function(list) {
		return new Promise(function(resolve) {
			HTTP.call("GET", 'https://api.trello.com/1/boards/t17C3Ilr/cards?fields=id,idList,name,desc&' + keyAndTokenParams, {
			},
			function(error, result) {
				if (!error) {
					var currentWorkingTasks = result.data.filter(cardList => cardList.idList == list.id);
					resolve(currentWorkingTasks);
				} else {
					console.error(error);
				}
			});
		});

	});
}
