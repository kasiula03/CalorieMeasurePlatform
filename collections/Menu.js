Menu = new Mongo.Collection('Menu');

var recipeAndAmount = new SimpleSchema({
	recipeId: {type: Number},
	amount: {type: Number}
});

var dailyMenu = new SimpleSchema({
	dayNumber: {type: Number},
	recipe: {type: [recipeAndAmount]}
});

var menuSchema = new SimpleSchema({
	userId: {type: String, regEx: SimpleSchema.RegEx.Id, optional: false},
	dayNumber: {type: Number},
	recipe: {type: [recipeAndAmount]}
});

if(Meteor.isServer) {
	 Meteor.publish('userMenu', function () {
	 	return Menu.find({userId: this.userId});
	 });

}