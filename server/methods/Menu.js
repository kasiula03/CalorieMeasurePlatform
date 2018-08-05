Meteor.methods({
	addDayToMenu: function (recipes) {
		var menu = Menu.find({userId: this.userId}).fetch();
	
		var recipesWithAmount = recipes.map(function(recipe) {
			return {
				recipeId: recipe.id,
				amount: recipe.amount,
				position: recipe.position,
				itProduct: recipe.itProduct
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
	editDayToMenu: function(recipes, dayNo) {
		var menu = Menu.findOne({userId: this.userId, dayNumber: dayNo});
		var recipesPerDays = menu.recipesPerDays;
		var recipesWithAmount = recipes.map(function(recipe) {
			return {
				recipeId: recipe.recipeId,
				amount: recipe.amount,
				position: recipe.position,
				itProduct: recipe.recipe.products == undefined
			}
		});
		var newMenu = {
			userId: this.userId,
			dayNumber: dayNo,
			recipesPerDays: recipesWithAmount
		};
		Menu.update(menu._id, newMenu);
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
				position: lastPosition + 1,
				itProduct: recipe.itProduct
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
	removeMenuDay: function(dayNo) {
		var menu = Menu.findOne({userId: this.userId, dayNumber: dayNo});
		Menu.remove(menu._id);
	},
	removeRecipeFromDay: function(dayNo, position) {
		var menu = Menu.findOne({userId: this.userId, dayNumber: dayNo});
		var recipesPerDays = menu.recipesPerDays;
		var recipeWithout = recipesPerDays.filter(e =>  e.position !== position);
		menu.recipesPerDays = recipeWithout;
		Menu.update(menu._id, menu);
	},
	moveRecipe: function(dayNr, recipePosition, where) {
		var menu = Menu.findOne({userId: this.userId, dayNumber: dayNr});
		var recipesPerDays = menu.recipesPerDays;
		console.log(recipesPerDays);
		var recipesWithNewPosition = moveRecipePositionFrom(recipesPerDays, recipePosition, where);
		menu.recipesPerDays = recipesWithNewPosition;
		Menu.update(menu._id, menu);
	}
});

moveRecipePositionFrom = function(recipes, recipePosition, where) {
	return recipes.map(recp => {
		if(recp.position == recipePosition) {
			recp.position += where;
		}
		else if (recp.position == recipePosition + where) {
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