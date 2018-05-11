Session.setDefault('addNewMenuDay', false);

Template.Menu.helpers({
	menuDays: function() {
		
	}
});

Template.AddToMenu.events({
	'click .newDay': function(event, target) {
		if(Session.get('addNewMenuDay')) {
			Session.set('addNewMenuDay', false);
			$(event.target).removeClass("fa-minus-square").addClass("fa-plus-square");
		} else {
			Session.set('addNewMenuDay', true);
			$(event.target).removeClass("fa-plus-square").addClass("fa-minus-square");
		}	
	},
	'keyup [name="recipeAmount"]': function(event, template) {
		let newAmount = event.target.value.trim();
		var recipes = Session.get('choosenRecipes');
		var id = this._id;
		recipes.find(recipe => recipe.id == id).amount = newAmount;
		
		Session.set('choosenRecipes', recipes);
	},
	'submit form': function(event, template) {
		event.preventDefault();
		console.log(Session.get('choosenRecipes'));
		Meteor.call('addDayToMenu', Session.get('choosenRecipes'));
		
	}
});

Template.AddToMenu.helpers({
	addNewMenuDay: function () {
		return Session.get('addNewMenuDay');
	},
	choosenRecipes: function() {
		var currentRecipes = Session.get('choosenRecipes');
		return currentRecipes.map((recipe) => {
			var foundRecipe = Recipes.findOne(recipe.id);
			foundRecipe.calorie = foundRecipe.calorie * recipe.amount;
			foundRecipe.protein = foundRecipe.protein * recipe.amount;
			foundRecipe.fat = foundRecipe.fat * recipe.amount;
			foundRecipe.carb = foundRecipe.carb * recipe.amount;
			foundRecipe.amount = recipe.amount;
			return foundRecipe;
		});
	}
});