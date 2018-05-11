Menu = new Mongo.Collection('Menu');

var dailyMenu = new SimpleSchema({
	dayNumber: {type: Number},
	recipeIds: {type: [Number]}
});

var menuSchema = new SimpleSchema({
	userId: {type: String, regEx: SimpleSchema.RegEx.Id, optional: false},
	recipesPerDays: {type: [dailyMenu]}

});

if(Meteor.isServer) {
	 Meteor.publish('userMenu', function () {
	 	return Menu.findOne({userId: this.userId});
	 });

}