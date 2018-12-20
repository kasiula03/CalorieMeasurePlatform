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
	},
	fixedRecipe: function() {
		var fixedRecipe = setPrecisionToNutririonals(this);
		fixedRecipe.editable = true;
		return fixedRecipe;
	}
});

Template.Recipes.events({
	'submit form': function(event, template) {
		event.preventDefault();
		var link = event.target.linkTextBox.value;
		Meteor.call('addLink', this._id, link);
		event.target.linkTextBox.value = "";
		$(event.target).fadeOut();
		
	},
	'click .addLink': function(event, template) {
		event.preventDefault();
		if(event.target.addLink) {
			event.target.addLink = false;
		 	$(event.target).parent().parent().children("#edit-link").fadeOut();
		}
		else {
			event.target.addLink = true;
			$(event.target).parent().parent().children("#edit-link").fadeIn();
		}
	},
	'click .edit-product': function(event, template) {
		var products = this.products.map(product => {
			return {
				productName: product.productName,
				weight: parseFloat(product.weight).toPrecision(3).toString(),
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