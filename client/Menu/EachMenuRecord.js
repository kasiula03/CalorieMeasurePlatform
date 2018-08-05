Template.EachMenuRecord.events({
	'click .remove-recipe' : function(event, template) {
		event.preventDefault();
		Meteor.call('removeRecipeFromDay', this.dayNumber, this.position);
	}
});