Session.setDefault('choosenRecipes', []);

Template.SearchRecipe.onRendered(function() {
  this.subscribe('allRecipes');
});

Template.SearchRecipe.onCreated( () => {
  let template = Template.instance();

  template.searchQuery = new ReactiveVar();

});

Template.SearchRecipe.helpers({
  query() {
    return Template.instance().searchQuery.get();
  },
  lookingProducts() {
    if(Template.instance().searchQuery.get()) {
      let regex = new RegExp( Template.instance().searchQuery.get(), 'i' );
      let query = { name: regex };
      let queryProduct = { name: regex, canBeMeal: true };
      return Recipes.find(query).fetch().concat(Products.find(queryProduct).fetch());
    } else {
      return null;
    }
  }
});

Template.SearchRecipe.events({
  'keyup [name="search"]': function ( event, template ) {
    let value = event.target.value.trim();
    let regex = new RegExp( value, 'i' );
    let query = { recipeName: regex };
    Template.instance().searchQuery.set(value);
  },
  'click .recipe': function (event, template) {
    event.preventDefault();
    var holdingName = template.data.toSave;
    if(holdingName == undefined)
      holdingName = "choosenRecipes";

    var id = this._id;
    var currentRecipes = [];
    if(Session.get(holdingName) !== undefined) {
      currentRecipes = Session.get(holdingName);;
    }

    var position = currentRecipes.length;
    var prod = this.canBeMeal !== undefined;
    currentRecipes.push({
      recipeName: this.name, 
      id: this._id, 
      amount: 0,
      position: position,
      itProduct: prod
    });
    Session.set(holdingName, currentRecipes);
    Template.instance().searchQuery.set("");
  }
});