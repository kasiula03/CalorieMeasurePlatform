Meteor.methods({
	addDayToMenu: function (recipes) {
		var menu = Menu.find({userId: this.userId}).fetch();
	
		var recipesWithAmount = recipes.map(function(recipe) {
			return {
				recipeId: recipe.id,
				amount: recipe.amount,
				position: recipe.position
			}
		});
		var recipesPerDays = menu.recipesPerDays;
		var previousDay = getPreviousDay(menu);;

		var newMenu = {
			userId: this.userId,
			dayNumber: previousDay + 1,
			recipesPerDays: recipesWithAmount
		};

		Menu.insert(newMenu);

	},
	addRecipeToDay: function (recipes, dayNo) {
		var menu = Menu.findOne({userId: this.userId, dayNumber: dayNo});
		var recipesPerDays = menu.recipesPerDays;
		var positions = recipesPerDays.map(recipe => recipe.position);
		var lastPosition = Math.max(...positions);
		 recipes.forEach(function(recipe) {
			recipesPerDays.push( {
				recipeId: recipe.id,
				amount: recipe.amount,
				position: lastPosition + 1
			});
			lastPosition +=1;
		});
		

		var newMenu = {
			userId: this.userId,
			dayNumber: dayNo,
			recipesPerDays: recipesPerDays
		};

		Menu.update(menu._id, newMenu);

	},
	removeRecipeFromDay: function(dayNo, position) {
		var menu = Menu.findOne({userId: this.userId, dayNumber: dayNo});
		var recipesPerDays = menu.recipesPerDays;
		var recipeWithout = recipesPerDays.filter(e =>  e.position !== position);
		menu.recipesPerDays = recipeWithout;
		if(recipeWithout.length == 0) {
			Menu.remove(menu._id);
		} else {
			Menu.update(menu._id, menu);
		}
		
	},
	moveRecipe: function(recipe, where) {
		var menu = Menu.findOne({userId: this.userId, dayNumber: recipe.dayNumber});
		var recipesPerDays = menu.recipesPerDays;
		var recipesWithNewPosition = moveRecipePositionFrom(recipesPerDays, recipe, where);
		menu.recipesPerDays = recipesWithNewPosition;
		Menu.update(menu._id, menu);
	}
});

moveRecipePositionFrom = function(recipes, recipe, where) {
	return recipes.map(recp => {
		if(recp.position == recipe.position) {
			recp.position += where;
		}
		else if (recp.position == recipe.position + where) {
			recp.position -= where;

		}
		return recp;
	});
}

getPreviousDay = function(menu) {
	var last = 0;
	menu.forEach(day => {
		if(day.dayNumber > last)
			last = day.dayNumber;
	});
	return last;
}

createEmptyMenuForUser = function(userID) {
	Menu.insert({
		userId: userID,
		recipesPerDays: []});
}