Products = new Mongo.Collection('Products');

Products.schema = new SimpleSchema({
	name: {type: String},
	nutritionals: {type: Object}
});

if(Meteor.isServer) {
	 Meteor.publish('allProducts', function () {
	 	return Products.find();
	 });
}