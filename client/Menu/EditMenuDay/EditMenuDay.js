Session.setDefault("toEdit", []);

Template.EditMenuDay.onCreated(function() {
	let template = Template.instance();
	// slice needed because it set reference
	template.tempRecipes = new ReactiveVar(this.data.recipes.slice(0));
});

Template.EditMenuDay.events({
	'submit #edit-day-form': function(event, template) {
		event.preventDefault();
		let recipes = template.tempRecipes.get();
		recipes.forEach(recp => recp.recipe.recipe = null);
		Meteor.call('editDayToMenu', recipes, this.dayNumber);
		Session.set('editDay' + this.dayNumber, false);
	},
	'keyup [name="recipeAmount"]': function(event, template) {
		let newAmount = event.target.value.trim();
		var recipes = template.tempRecipes.get();
		var id = this._id;
		var position = this.position;
		var recipeToModify = recipes.find(recipe => recipe.id == id && recipe.position == position);
		recipeToModify.amount = parseInt(newAmount);
		template.tempRecipes.set(recipes);
	},
	'click .close': function (event, template) {
		Session.set('editDay' + this.dayNumber, false);
	},
	'click .delete-recipe': function (event, template) {
		event.preventDefault();
		var recipes = template.tempRecipes.get();
		var oldRecipePosition = this.position;
		template.tempRecipes.set(moveOtherRecipes(recipes.filter(recp => recp.position != oldRecipePosition), oldRecipePosition));
	},
	'click .move-recipe-down': function(event, template) {
		event.preventDefault();
		var recipes = template.tempRecipes.get();
		template.tempRecipes.set(moveRecipePositionFrom(recipes, this, 1));

	},
	'click .move-recipe-up': function(event, template) {
		event.preventDefault();
		var recipes = template.tempRecipes.get();
		template.tempRecipes.set(moveRecipePositionFrom(recipes, this, -1));
		
	},
	'submit #new-recipe-form': function(event, template) {
		event.preventDefault();
		var dayNumber = parseInt(this.dayNumber);
		Meteor.call('addRecipeToDay', Session.get(dayNumber), dayNumber);
		Session.set(dayNumber, []);
		
	}
});

Template.EditMenuDay.helpers({
	sumRecipes: function(recipes) {
		var nutrients = recipes.map(recipe => { return {
			calorie: parseFloat(recipe.recipe.calorie),
			carb: parseFloat(recipe.recipe.carb),
			fat: parseFloat(recipe.recipe.fat),
			protein: parseFloat(recipe.recipe.protein)
		}});
		return {
			calorie: nutrients.map(nut => nut.calorie).reduce((a,b) => a + b, 0).toFixed(3),
			protein: nutrients.map(nut => nut.protein).reduce((a,b) => a + b, 0).toFixed(3),
			fat: nutrients.map(nut => nut.fat).reduce((a,b) => a + b, 0).toFixed(3),
			carb: nutrients.map(nut => nut.carb).reduce((a,b) => a + b, 0).toFixed(3)
		}
	},
	newRecipes: function() {
		var toAdd = Session.get("toEdit");
		var recipes = Template.instance().tempRecipes.get();
		var maxPosition = Math.max(...recipes.map(recipe => recipe.position));
		if(toAdd.length > 0) {
			var foundRecipe;
			var recipeToAdd = toAdd[0];
			if(isFinite(maxPosition)) {
				recipeToAdd.position = maxPosition + 1;
			}
			else {
				recipeToAdd.position = 0;
			}
			if(recipeToAdd.itProduct) {
				foundRecipe = Products.findOne(recipeToAdd.id);
			} else {
				foundRecipe = Recipes.findOne(recipeToAdd.id);
			}
			foundRecipe.calorie = 0;
			foundRecipe.protein = 0;
			foundRecipe.fat = 0;
			foundRecipe.carb = 0;
			foundRecipe.amount = recipeToAdd.amount;
			foundRecipe.position = recipeToAdd.position;;
			var newRecipe = {
				recipeId: recipeToAdd.id,
				dayNumber: this.dayNumber,
				amount: "0",
				position: recipeToAdd.position,
				recipe: foundRecipe
			};
			recipes.push(newRecipe);
			Session.set("toEdit", []);
			Template.instance().tempRecipes.set(recipes);
		}
		return Template.instance().tempRecipes.get().map(recipe => {
			var foundRecipe;
			if(recipe.recipe.products == undefined) {
				foundRecipe = Products.findOne(recipe.recipeId);
				recipe.recipe.calorie = parseFloat(foundRecipe.nutritionals.calorie) * 0.01 * recipe.amount;
				recipe.recipe.protein = parseFloat(foundRecipe.nutritionals.protein) * 0.01 * recipe.amount;
				recipe.recipe.fat = parseFloat(foundRecipe.nutritionals.fat) * 0.01 * recipe.amount;
				recipe.recipe.carb = parseFloat(foundRecipe.nutritionals.carb) * 0.01 * recipe.amount;
				recipe.recipe.amount = parseInt(recipe.amount);
				recipe.position = recipe.position;
			} else {
				foundRecipe = Recipes.findOne(recipe.recipeId);
				recipe.recipe.calorie = parseFloat(foundRecipe.calorie) * recipe.amount;
				recipe.recipe.protein = parseFloat(foundRecipe.protein) * recipe.amount;
				recipe.recipe.fat = parseFloat(foundRecipe.fat) * recipe.amount;
				recipe.recipe.carb = parseFloat(foundRecipe.carb) * recipe.amount;
				recipe.recipe.amount = parseInt(recipe.amount);
				recipe.position = recipe.position;
			}
			return recipe;
		}).sort(compareByPosition);
	},
	firstPosition: function(position) {
		return position == 0;
	},
	lastPosition: function(recipes, position) {
		var maxPosition = Math.max(...recipes.map(recipe => recipe.position));
		return maxPosition == position;
	}
});

compareByPosition = function (a, b) {
	return a.position > b.position;
}
