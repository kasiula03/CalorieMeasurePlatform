Session.setDefault('addNewMenuDay', false);
Session.setDefault('editMenuDay', false);
Session.setDefault('dayRecipes', []);
Session.setDefault('choosenRecipes', []);

Template.Menu.onRendered(function() {
	this.subscribe('userMenu');
  	this.subscribe('allRecipes');
});


Template.Menu.helpers({
	menuDays: function() {
		var menus = Menu.find().fetch();
		if(menus.length > 0) {
			return menus.map(function(menu) {
					return {
						dayNumber: menu.dayNumber,
						recipes : menu.recipesPerDays.map(function(day) {
							if(Recipes.findOne(day.recipeId) !== undefined)
							{
								return {
									recipeId: day.recipeId,
									recipe: multiplyRecipeAttr(Recipes.findOne(day.recipeId), day.amount),
									amount: day.amount,
									dayNumber: menu.dayNumber,
									position: day.position
								}
							}
								
						}).sort((a,b) => a.position > b.position)

					}
			});

		} else {
			return [];
		}

	},
	allMenuRecipes: function() {
		var menus = Menu.find().fetch();
		if(menus.length > 0) {
			var recipes = menus.map(function(menu) {
					return {
						dayNumber: menu.dayNumber,
						recipes : menu.recipesPerDays.map(function(day) {
							if(Recipes.findOne(day.recipeId) !== undefined)
							{
								return {
									recipeId: day.recipeId,
									recipe: multiplyRecipeAttr(Recipes.findOne(day.recipeId), day.amount),
									amount: day.amount,
									dayNumber: menu.dayNumber,
									position: day.position
								}
							}
								
						}).sort((a,b) => a.position > b.position)

					}
			}).map(menu => menu.recipes);
			return [].concat.apply([], recipes);
		} else {
			return [];
		}
	},
	editDay: function() {
		return Session.get('editMenuDay');
	},
	addNewMenuDay: function () {
		return Session.get('addNewMenuDay');
	},
	firstPosition: function(position) {
		return position == 0;
	},
	lastPosition: function(recipes, position) {
		var maxPosition = Math.max(...recipes.map(recipe => recipe.position));
		return maxPosition == position;
	},
	getDay: function(dayNumber) {
		return moment.weekdays(true, dayNumber - 1);
	},
	sumRecipes: function(recipes) {
		var nutrients = recipes.map(recipe => { return {
			calorie: recipe.recipe.calorie,
			carb: recipe.recipe.carb,
			fat: recipe.recipe.fat,
			protein: recipe.recipe.protein
		}});
		return {
			calorie: nutrients.map(nut => nut.calorie).reduce((a,b) => a + b, 0),
			protein: nutrients.map(nut => nut.protein).reduce((a,b) => a + b, 0),
			fat: nutrients.map(nut => nut.fat).reduce((a,b) => a + b, 0),
			carb: nutrients.map(nut => nut.carb).reduce((a,b) => a + b, 0)
		}
	},
	accumulatedRecipes: function (recipesPerDay) {
		var recipes = recipesPerDay.map(recipe =>  {
			return {
				products: recipe.recipe.products,
				amount: parseInt(recipe.amount)
			}
		});
		var multiplied = recipes.map(recipe => {
			var amount = recipe.amount;
			var products = recipe.products;
			return multipleProductsWeight(products, amount);
		});
		var results = [].concat.apply([], multiplied);
		var merged = new Map();
		results.forEach(product => {
			var empty = {
				name: product.name,
				id: product.id
			}
			if(merged.get(empty.id) !== undefined) {
				merged.get(empty.id).weight += product.weight;
			}
			else {
				empty.weight = product.weight;
				merged.set(empty.id, empty);
			}
		});
		console.log(merged);
	}
});

Template.Menu.events({
	'click .remove-recipe-menu': function(event, target) {
		Meteor.call('removeRecipeFromDay', this.dayNumber, this.position);
	},
	'click .newDay': function(event, target) {
		if(Session.get('addNewMenuDay')) {
			Session.set('addNewMenuDay', false);
			$(event.target).removeClass("fa-minus-square").addClass("fa-plus-square");
		} else {
			Session.set('addNewMenuDay', true);
			$(event.target).removeClass("fa-plus-square").addClass("fa-minus-square");
		}
		
	},
	'click .edit-recipe-menu': function(event, target) {
		if(event.target.open) {
			$(event.target).removeClass("fa-minus-square").addClass("fa-plus-square");
			$(event.target).parent().parent().children('#recipe-list').css('display', "none");
			event.target.open = false;
		} else {
			$(event.target).removeClass("fa-plus-square").addClass("fa-minus-square");
			$(event.target).parent().parent().children('#recipe-list').css('display', "block");
			event.target.open = true;
		}
	},
	'click .move-recipe-down': function(event, template) {
		Meteor.call('moveRecipe', this, 1);
	},
	'click .move-recipe-up': function(event, template) {
		Meteor.call('moveRecipe', this, -1);
	},
	'submit #new-recipe-form': function(event, template) {
		event.preventDefault();
		var dayNumber = parseInt(this.dayNumber);
		Meteor.call('addRecipeToDay', Session.get(dayNumber), dayNumber);
		Session.set(dayNumber, []);
		
	},
	'submit #new-day-form': function(event, template) {
		event.preventDefault();
		Meteor.call('addDayToMenu', Session.get('choosenRecipes'));
		Session.set('choosenRecipes', []);
	}

});


multiplyRecipeAttr = function(recipe, amount) {
	return {
		name: recipe.name,
		calorie: recipe.calorie * amount,
		protein: recipe.protein * amount,
		fat: recipe.fat * amount,
		carb: recipe.carb * amount,
		products: recipe.products
	}
}

Template.AddToMenu.events({
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
		var holdingName = template.data.handling;
		if(holdingName == undefined)
      		holdingName = "choosenRecipes";
      	console.log(holdingName);
	},
	'click .move-recipe-down': function(event, template) {
		moveChoosenRecipe(template, this, 1);
	},
	'click .move-recipe-up': function(event, template) {
		moveChoosenRecipe(template, this, -1);
	}

});

moveChoosenRecipe = function(template, recipe, where) {
	var holdingName = template.data.handling;
	if(holdingName == undefined)
      	holdingName = "choosenRecipes";
    var currentRecipes = Session.get(holdingName);
    console.log(currentRecipes);
    console.log(recipe);
    var recipeWithNewPositions = moveRecipePositionFrom(currentRecipes, recipe, where);
    
    Session.set(holdingName, recipeWithNewPositions); 
}

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

Template.AddToMenu.helpers({
	choosenRecipes: function(handling) {
		var holdingName = handling;
		if(holdingName == undefined)
      		holdingName = "choosenRecipes";
		var currentRecipes = Session.get(holdingName);
		if(currentRecipes !== undefined) {
			return currentRecipes.map((recipe) => {
				var foundRecipe = Recipes.findOne(recipe.id);
				foundRecipe.calorie = foundRecipe.calorie * recipe.amount;
				foundRecipe.protein = foundRecipe.protein * recipe.amount;
				foundRecipe.fat = foundRecipe.fat * recipe.amount;
				foundRecipe.carb = foundRecipe.carb * recipe.amount;
				foundRecipe.amount = recipe.amount;
				foundRecipe.position = recipe.position;
				return foundRecipe;
			}).sort((a,b) => a.position > b.position);
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