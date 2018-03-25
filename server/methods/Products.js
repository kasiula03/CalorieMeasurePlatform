Meteor.methods({
	addProduct: function(name, nutrs) {
		var product = {
			name: name,
			nutritionals: {
					calorie: parseFloat(nutrs.calorie.replace(',', '.')),
					protein: parseFloat(nutrs.protein.replace(',', '.')),
					fat: parseFloat(nutrs.fat.replace(',', '.')),
					carb: parseFloat(nutrs.carb.replace(',', '.')),
				}
		}
		Products.insert(product);
	},
	deleteProduct: function(id) {
		Products.remove(id);
	}
});