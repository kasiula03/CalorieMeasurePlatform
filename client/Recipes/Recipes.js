Session.setDefault('openEditModal', false);
Session.setDefault('addNewRecipe', false);

Template.Recipes.onRendered(function() {
	this.subscribe('allRecipes');

});

Template.Recipes.helpers({
	recipes: function() {
		return Recipes.find().fetch();
	},
	addNewRecipe: function() {
		return Session.get('addNewRecipe');
	}
});

Template.ShowRecipeProducts.helpers({
	openEditModal: function() {
		return Session.get('openEditModal');
	}
});

Template.Recipes.events({
	'click .edit-product': function(event, template) {
		var products = this.products.map(product => {
			return {
				productName: product.productName,
				weight: product.weight.toString(),
				id: product.id
			}
		});
		Session.set('openEditModal', true);
		Session.set('recipeToEdit', this);
		Session.set('choosenProducts', products);
	},
	'click .fa-window-close': function(event) {
		Session.set('openEditModal', false);
		Session.set('choosenProducts', [])
		Session.set('recipeToEdit', {});
	},
	'click .delete-recipe': function(event, template) {
		Meteor.call('deleteRecipe', this._id);
	},
	'click .newRecipe': function(event, target) {
		if(Session.get('addNewRecipe')) {
			Session.set('addNewRecipe', false);
			Session.set('choosenProducts', [])
			Session.set('recipeToEdit', {});
			$(event.target).removeClass("fa-minus-square").addClass("fa-plus-square");
		} else {
			Session.set('addNewRecipe', true);
			Session.set('choosenProducts', [])
			Session.set('recipeToEdit', {});
			$(event.target).removeClass("fa-plus-square").addClass("fa-minus-square");
		}	
	}
});

Template.ShowRecipeProducts.events({
	'click .show-products': function(event, template) {
		if(event.target.open) {
			$(event.target).removeClass("fa-arrow-up").addClass("fa-arrow-down");
			$(event.target).parent().parent().children('#products-list').css('display', "none");
			event.target.open = false;
		} else {
			$(event.target).removeClass("fa-arrow-down").addClass("fa-arrow-up");
			$(event.target).parent().parent().children('#products-list').css('display', "block");
			event.target.open = true;
		}
	}
});