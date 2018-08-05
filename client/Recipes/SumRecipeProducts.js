Template.SumRecipeProducts.onRendered(function() {
	 $('[data-toggle="tooltip"]').tooltip();   
});

Template.SumRecipeProducts.events({
	'click .pdf-button': function(event, template) {
		var mergedRecipes = accumulatedRecipes(this.allRecipes);
		var nameWithWeight = Array.from(mergedRecipes).map(([key, value]) => 
			// value.name + "\t\t" + value.weight + "g"
			[value.name, value.weight.toString()]
			);
		nameWithWeight.unshift(["Produkt","Ilość w gramach"]);
		var docDefinition = {
			content: nameWithWeight
		};
		var docDefinition = {
			content: [
			{text: 'Lista produktów', style: 'header'},

			{
				style: 'tableExample',
				table: {
					body: nameWithWeight
				}
			}
			],
			styles: {
				header: {
					fontSize: 18,
					bold: true,
					margin: [0, 0, 0, 10]
				},
				subheader: {
					fontSize: 16,
					bold: true,
					margin: [0, 10, 0, 5]
				},
				tableExample: {
					margin: [0, 5, 0, 15]
				},
				tableHeader: {
					bold: true,
					fontSize: 13,
					color: 'black'
				}
			}
		};

		pdfMake.createPdf(docDefinition).open();
	}
});

accumulatedRecipes = function (allRecipes) {
	var recipes = allRecipes.map(recipe =>  {
		if(recipe.recipe.products == undefined) {
			return {
				products: [{
					productName: recipe.recipe.name,
					weight: 1,
					id: recipe.recipeId
				}],
				amount: parseInt(recipe.amount)
			}
		} 
		else {
			return {
				products: recipe.recipe.products,
				amount: parseInt(recipe.amount)
			}
		}
	});
	var multiplied = recipes.map(recipe => {
		var amount = recipe.amount;
		var products = recipe.products;
		return multipleProductsWeight(products, amount);
	});
	var results = [].concat.apply([], multiplied);
	var merged = new Map();
	results.forEach(product => {
		var empty = {
			name: product.name,
			id: product.id
		}
		if(merged.get(empty.id) !== undefined) {
			merged.get(empty.id).weight += product.weight;
		}
		else {
			empty.weight = product.weight;
			merged.set(empty.id, empty);
		}
	});
	return merged;
}

multipleProductsWeight = function(products, amount) {
	return products.map(product => {
		return {
			name: product.productName,
			id: product.id,
			weight: product.weight * amount
		}
	});
}