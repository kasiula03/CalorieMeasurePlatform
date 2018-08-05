Meteor.subscribe('allProducts');

Template.Products.onRendered(function() {
 // this.subscribe( 'products', "");
});

Template.Products.events({
	'submit form': function(event, template) {
		event.preventDefault();
		var name = event.target.productName.value;
		var isMeal = event.target.isMeal.value;
		Meteor.call('addProduct', name, {
			calorie: event.target.productCalorie.value,
			protein: event.target.productProtein.value,
			fat: event.target.productFat.value,
			carb: event.target.productCarb.value
		}, isMeal);
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


Template.Product.events({
	'change [name="isMeal"]': function(event, template) {
		var isChecked = event.target.checked 
		Meteor.call('setProductAsMeal', this, isChecked);
	}
});

Template.Product.helpers({
	fixedProduct: function() {
		this.nutritionals = setPrecisionToNutririonals(this.nutritionals);
		if(this.canBeMeal == undefined)
			this.canBeMeal = false;
		return this;
	}
});

setPrecisionToNutririonals = function (obj) {
	obj.calorie = parseFloat(obj.calorie).toFixed(3);
	obj.carb = parseFloat(obj.carb).toFixed(3);
	obj.protein = parseFloat(obj.protein).toFixed(3);
	obj.fat = parseFloat(obj.fat).toFixed(3);
	return obj;
}

setPrecisionToNutririonals = function (obj, precis) {
	obj.calorie = parseFloat(obj.calorie).toFixed(precis);
	obj.carb = parseFloat(obj.carb).toFixed(precis);
	obj.protein = parseFloat(obj.protein).toFixed(precis);
	obj.fat = parseFloat(obj.fat).toFixed(precis);
	return obj;
}