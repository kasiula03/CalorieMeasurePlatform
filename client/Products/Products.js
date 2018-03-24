Meteor.subscribe('allProducts');

Template.Products.onRendered(function() {
 // this.subscribe( 'products', "");
});

Template.Products.events({
	'submit form': function(event, template) {
		event.preventDefault();
		var name = event.target.productName.value;
		Meteor.call('addProduct', name, {
			calorie: event.target.productCalorie.value,
			protein: event.target.productProtein.value,
			fat: event.target.productFat.value,
			carb: event.target.productCarb.value
		});
		event.target.productName.value = "";
		event.target.productCalorie.value = "";
		event.target.productProtein.value = "";
		event.target.productFat.value = "";
		event.target.productCarb.value = "";
	},
	'click .product-delete': function(event, template) {
		Meteor.call('deleteProduct', this._id);
	}
});

Template.Products.helpers({
	products: function () {
		return Products.find().fetch();
	}
});
