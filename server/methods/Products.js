Meteor.methods({
	addProduct: function(name, nutrs, isMeal) {
		var product = {
			name: name,
			nutritionals: {
					calorie: parseFloat(nutrs.calorie.replace(',', '.')).toFixed(3),
					protein: parseFloat(nutrs.protein.replace(',', '.')).toFixed(3),
					fat: parseFloat(nutrs.fat.replace(',', '.')).toFixed(3),
					carb: parseFloat(nutrs.carb.replace(',', '.')).toFixed(3),
				},
			canBeMeal: isMeal
		}
		Products.insert(product);
	},
	setProductAsMeal: function(product, isMeal) {
		product.canBeMeal = isMeal;
		Products.update(product._id, product);
	},
	deleteProduct: function(id) {
		Products.remove(id);
	}
});