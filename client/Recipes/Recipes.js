Template.Recipes.onRendered(function() {
	this.subscribe('allRecipes');

});

Template.Recipes.helpers({
	recipes: function() {
		return Recipes.find().fetch();
	}
})