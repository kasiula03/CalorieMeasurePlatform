Meteor.methods({
	addRecipe: function(recipeName, link, products) {
		var productStats = getRecipeStats(products);
		var productsWithWeight = products.map(function(product) {
			return {
				productName: getProductName(product.id),
				weight: parseFloat(product.weight.replace(',', '.')),
				id: product.id
			}
		});
		var recipe = {
			name: recipeName,
			calorie: productStats.calorie,
			protein: productStats.protein,
			fat: productStats.fat,
			carb: productStats.carb,
			products: productsWithWeight,
			link: link
		}
	
		Recipes.insert(recipe);
	},
	editRecipe: function(recipeId, recipeName, products) {
		var productStats = getRecipeStats(products);
		var productsWithWeight = products.map(function(product) {
			return {
				productName: getProductName(product.id),
				weight: parseFloat(product.weight.replace(',', '.')),
				id: product.id
			}
		});
		var recipe = {
			name: recipeName,
			calorie: productStats.calorie,
			protein: productStats.protein,
			fat: productStats.fat,
			carb: productStats.carb,
			products: productsWithWeight
		}
	
		Recipes.update(recipeId, recipe);
	},
	deleteRecipe: function(recipeId) {
		Recipes.remove(recipeId);
	},
	addLink: function(recipeId, link) {
		var recipe = Recipes.findOne(recipeId);
		recipe.link = link;
		Recipes.update(recipeId, recipe);
	}
});

getProductName = function(productId) {
	return Products.findOne(productId).name;
}

getRecipeStats = function(products) {
	var productsStats = products.map((product) => {
		var stats = getProductStats(product.id);
		stats["weight"] = parseFloat(product.weight);
		return stats;
	});
	return {
		calorie: getSumStasts(productsStats.map((product) => toSumPrepare(product, "calorie"))),
		protein: getSumStasts(productsStats.map((product) => toSumPrepare(product, "protein"))),
		fat: getSumStasts(productsStats.map((product) => toSumPrepare(product, "fat"))),
		carb: getSumStasts(productsStats.map((product) => toSumPrepare(product, "carb")))
	}
}

getProductStats = function(productId) {
	return Products.findOne(productId).nutritionals;
}

toSumPrepare = function(product, fieldName) {
	return {
		toSum: product[fieldName],
		weight: product.weight
	}
}

getSumStasts = function(stats) {
	var sum = 0;
	stats.forEach(stats => sum += stats.toSum * stats.weight * 0.01);
	return sum.toFixed(3);
}