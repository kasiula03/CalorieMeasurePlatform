Session.setDefault('choosenProducts', []);

Template.NewRecipes.onCreated(function() {
	let template = Template.instance();

  	template.choosenProducts = new ReactiveVar();
});

Template.NewRecipes.helpers({
	choosenProducts: function() {
		var products = Session.get('choosenProducts');
		return products;
	}
});

Template.NewRecipes.events({
	'click .deleteProduct': function(event, template) {
		var products = Session.get('choosenProducts');
		var id = this.id;
		Session.set('choosenProducts', products.filter(product => product.id != id));
	},
	'keyup [name="productWeight"]': function(event, template) {
		let newWeight = event.target.value.trim();
		var products = Session.get('choosenProducts');
		var id = this.id;
		products.find(product => product.id == id).weight = newWeight;
		Session.set('choosenProducts', products);
	},
	'submit form': function(event, template) {
		event.preventDefault();
		var recipeName = event.target.recipeName.value;
		Meteor.call('addRecipe', recipeName, Session.get('choosenProducts'));
		event.target.recipeName.value = ""
		Session.set('choosenProducts', []);
	}
});