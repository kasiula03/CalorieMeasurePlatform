Session.setDefault('addNewMenuDay', false);
Session.setDefault('editMenuDay', false);
Session.setDefault('dayRecipes', []);
Session.setDefault('choosenRecipes', []);

Template.Menu.onRendered(function() {
	this.subscribe('userMenu');
	this.subscribe('allRecipes');
});

Template.MenuDay.helpers({
	editDay: function() {
		return Session.get('editDay' + this.dayNumber);
	},
	getDay: function(dayNumber) {
		return moment.weekdays(true, dayNumber - 1);
	},
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
	}
});

Template.MenuDay.events({
	'click .delete-day': function(event) {
		event.preventDefault();
		if(confirm("Jesteś pewny, że chcesz usunąć cały dzień?")) {
			Meteor.call('removeMenuDay', this.dayNumber);
		}
	},
	'click .edit-day': function(event, template) {
		//var modal = document.getElementById('EditDayModal');
		//modal.style.display = "block";
		Session.set('editDay' + this.dayNumber, true);
	}
});

Template.Menu.helpers({
	menuDays: function() {
		var menus = Menu.find().fetch();
		if(menus.length > 0) {
			return menus.map(function(menu) {
				return convertMenu(menu);
			});
		} else {
			return [];
		}

	},
	allMenuRecipes: function() {
		var menus = Menu.find().fetch();
		if(menus.length > 0) {
			var recipes = menus.map(function(menu) {
				return convertMenu(menu);
			}).map(menu => menu.recipes);
			return [].concat.apply([], recipes);
		} else {
			return [];
		}
	},
	addNewMenuDay: function () {
		return Session.get('addNewMenuDay');
	},
	firstPosition: function(position) {
		return position == 0;
	},
	
	fixedRecipe: function() {
		return fixRecipe(this);
	},
	
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
	}
});

fixRecipe = function (recipe) {
	//do produktow
	recipe.recipe = setPrecisionToNutririonals(recipe);
	recipe.amount = parseFloat(recipe.amount).toFixed(3);
	return recipe;
}

convertMenu = function (menu) {
	return {
		dayNumber: menu.dayNumber,
		recipes : menu.recipesPerDays.map(function(day) {
			if(day.itProduct) {
				if(Products.findOne(day.recipeId) !== undefined)
				{
					var product = Products.findOne(day.recipeId);
					var transformed = {
						name: product.name,
						calorie: product.nutritionals.calorie * 0.01,
						protein: product.nutritionals.protein * 0.01,
						fat: product.nutritionals.fat * 0.01,
						carb: product.nutritionals.carb * 0.01
					};
					return {
						recipeId: day.recipeId,
						recipe: fixRecipe(multiplyRecipeAttr(transformed, day.amount)),
						amount: day.amount,
						dayNumber: menu.dayNumber,
						position: day.position
					}
				}
			} else{
				if(Recipes.findOne(day.recipeId) !== undefined)
				{
					return {
						recipeId: day.recipeId,
						recipe: fixRecipe(multiplyRecipeAttr(Recipes.findOne(day.recipeId), day.amount)),
						amount: day.amount,
						dayNumber: menu.dayNumber,
						position: day.position
					}
				}
			}

		}).sort((a,b) => a.position > b.position)

	}
}

Template.Menu.events({
	'click .remove-recipe-menu': function(event, target) {
		event.preventDefault();
		Meteor.call('removeRecipeFromDay', this.dayNumber, this.position);
	},
	'click .newDay': function(event, target) {
		event.preventDefault();
		if(Session.get('addNewMenuDay')) {
			Session.set('addNewMenuDay', false);
			$(event.target).removeClass("fa-minus-square").addClass("fa-plus-square");
		} else {
			Session.set('addNewMenuDay', true);
			$(event.target).removeClass("fa-plus-square").addClass("fa-minus-square");
		}
	},
	'click .edit-recipe-menu': function(event, target) {
		event.preventDefault();
		if(event.target.open) {
			$(event.target).removeClass("fa-minus-square").addClass("fa-plus-square");
			$(event.target).parent().parent().children('#recipe-list').css('display', "none");
			event.target.open = false;
		} else {
			$(event.target).removeClass("fa-plus-square").addClass("fa-minus-square");
			$(event.target).parent().parent().children('#recipe-list').css('display', "block");
			event.target.open = true;
		}
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