Template.AddToMenu.events({
	'submit #new-day-form': function(event, template) {
		event.preventDefault();
		Meteor.call('addDayToMenu', Session.get('choosenRecipes'));
		Session.set('choosenRecipes', []);
	},
	'keyup [name="recipeAmount"]': function(event, template) {
		var holdingName = template.data.handling;
		if(holdingName == undefined)
			holdingName = "choosenRecipes";
		let newAmount = event.target.value.trim();
		var recipes = Session.get(holdingName);
		var id = this._id;
		var position = this.position;
		recipes.find(recipe => recipe.id == id && recipe.position == position).amount = newAmount;
		
		Session.set(holdingName, recipes);
	},
	'click .remove-recipe-toAdd' : function(event, template) {
		event.preventDefault();
		var holdingName = template.data.handling;
		if(holdingName == undefined)
			holdingName = "choosenRecipes";
		var recipes = Session.get(holdingName);
		var oldRecipePosition = this.position;
		Session.set(holdingName, moveOtherRecipes(recipes.filter(recp => recp.position != oldRecipePosition), oldRecipePosition));
	},
	'click .move-recipe-down': function(event, template) {
		event.preventDefault();
		moveChoosenRecipe(template, this, 1);
	},
	'click .move-recipe-up': function(event, template) {
		event.preventDefault();
		moveChoosenRecipe(template, this, -1);
	}

});

Template.AddToMenu.helpers({
	choosenRecipes: function(handling) {
		var holdingName = handling;
		if(holdingName == undefined)
			holdingName = "choosenRecipes";
		var currentRecipes = Session.get(holdingName);
		console.log(currentRecipes);
		if(currentRecipes !== undefined) {
			var converted =  currentRecipes.map((recipe) => convertRecipeByAmount(recipe)).sort((a,b) => a.position > b.position);
			console.log(converted);
			return converted;
		}
		else 
			return [];
	},
	firstPosition: function(position) {
		return position == 0;
	},
	lastPosition: function(recipes, position) {
		var maxPosition = Math.max(...recipes.map(recipe => recipe.position));
		return maxPosition == position;
	},
	sumRecipes: function(recipes) {
		var nutrients = recipes.map(recipe => { return {
			calorie: recipe.calorie,
			carb: recipe.carb,
			fat: recipe.fat,
			protein: recipe.protein
		}});
		return {
			calorie: nutrients.map(nut => nut.calorie).reduce((a,b) => a + b, 0),
			protein: nutrients.map(nut => nut.protein).reduce((a,b) => a + b, 0),
			fat: nutrients.map(nut => nut.fat).reduce((a,b) => a + b, 0),
			carb: nutrients.map(nut => nut.carb).reduce((a,b) => a + b, 0)
		}
	}
});

convertRecipeByAmount = function (recipe) {
	var foundRecipe;
	if(recipe.itProduct) {
		foundRecipe = Products.findOne(recipe.id);
		foundRecipe.calorie = foundRecipe.nutritionals.calorie * 0.01 * recipe.amount;
		foundRecipe.protein = foundRecipe.nutritionals.protein * 0.01 * recipe.amount;
		foundRecipe.fat = foundRecipe.nutritionals.fat * 0.01 * recipe.amount;
		foundRecipe.carb = foundRecipe.nutritionals.carb * 0.01 * recipe.amount;
		foundRecipe.amount = recipe.amount;
		foundRecipe.position = recipe.position;
	} else {
		foundRecipe = Recipes.findOne(recipe.id);
		foundRecipe.calorie = foundRecipe.calorie * recipe.amount;
		foundRecipe.protein = foundRecipe.protein * recipe.amount;
		foundRecipe.fat = foundRecipe.fat * recipe.amount;
		foundRecipe.carb = foundRecipe.carb * recipe.amount;
		foundRecipe.amount = recipe.amount;
		foundRecipe.position = recipe.position;
	}

	return foundRecipe;
}

moveChoosenRecipe = function(template, recipe, where) {
	var holdingName = template.data.handling;
	if(holdingName == undefined)
		holdingName = "choosenRecipes";
	var currentRecipes = Session.get(holdingName);
	var recipeWithNewPositions = moveRecipePositionFrom(currentRecipes, recipe, where);

	Session.set(holdingName, recipeWithNewPositions); 
}

moveRecipePositionFrom = function(recipes, recipe, where) {
	var oldRecipePosition = recipe.position;
	return recipes.map(recp => {
		if(oldRecipePosition + where > -1 && oldRecipePosition + where < recipes.length) {
			if(recp.position == oldRecipePosition) {
				recp.position += where;
			}
			else if (recp.position == oldRecipePosition + where) {
				recp.position -= where;

			}
		}
		return recp;
	});
}

moveOtherRecipes = function(recipes, oldRecipePosition) {
	var i;
	for(i = 0; i < recipes.length; i++) {
		if(recipes[i].position > oldRecipePosition){
			recipes[i].position -= 1;
		}
	}
	return recipes;
}
