Meteor.methods({
	addDayToMenu: function (recipes) {
		var menu = Menu.findOne({userId: this.userId});
		if(!menu) {
			createEmptyMenuForUser();
			menu = Menu.findOne({userId: this.userId});
		}
		var newRecipesPerDays = menu.recipesPerDays;
		var recipesIds = recipes.map((recipe) => recipe.id);
		var previousDay = getPreviousDay(menu);
		var dailyMenu = {
			dayNumber: previousDay + 1,
			recipeIds: recipesIds
		};

		newRecipesPerDays.push(dailyMenu);

		var newMenu = {
			recipesPerDays: newRecipesPerDays
		};

		console.log(newMenu);

		Menu.update(menu._id, newMenu);

	}
});

getPreviousDay = function(menu) {
	var lastDay = menu.recipesPerDays[menu.recipesPerDays.length - 1];
	return lastDay ? lastDay.dayNumber : 0;
}

createEmptyMenuForUser = function() {
	Menu.insert({
		userId: this.userId,
		recipesPerDays: []});
}