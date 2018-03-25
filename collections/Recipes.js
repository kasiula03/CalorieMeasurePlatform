Recipes = new Mongo.Collection('Recipes');

var productWithWeigth = new SimpleSchema({
	productName: {type: String},
	weight: {type: Number},
	id: {type: String}
});

var recipesSchema = new SimpleSchema({
	name: {type: String, optional: false},
	colorie: {type: Number},
	protein: {type: Number},
	fat: {type: Number},
	carb: {type: Number},
	products: {type: [productWithWeigth]}
});

// Recipes.attachSchema(recipesSchema);

SimpleSchema.debug = true

if(Meteor.isServer) {
	 Meteor.publish('allRecipes', function () {
	 	return Recipes.find();
	 });

}