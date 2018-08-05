Template.ShowRecipeProducts.helpers({
	openEditModal: function() {
		return Session.get('openEditModal') && this.editable;
	},
	fixedRecipe: function() {
		this.weight = parseFloat(this.weight).toPrecision(3);
		return this;
	}
});

Template.ShowRecipeProducts.events({
	'click .show-products': function(event, template) {
		event.preventDefault();
		if(event.target.open) {
			$(event.target).removeClass("fa-arrow-up").addClass("fa-arrow-down");
			$(event.target).parent().parent().children('#products-list').css('display', "none");
			event.target.open = false;
		} else {
			$(event.target).removeClass("fa-arrow-down").addClass("fa-arrow-up");
			$(event.target).parent().parent().children('#products-list').css('display', "block");
			event.target.open = true;
		}
	}
});