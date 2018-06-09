Session.setDefault('choosenRecipes', []);

Template.SearchRecipe.onRendered(function() {
  this.subscribe('allRecipes');
});

Template.SearchRecipe.onCreated( () => {
  let template = Template.instance();

  template.searchQuery = new ReactiveVar();
  template.searching   = new ReactiveVar( false );

});

Template.SearchRecipe.helpers({
  searching() {
    return Template.instance().searching.get();
  },
  query() {
    return Template.instance().searchQuery.get();
  },
  lookingProducts() {
    if(Template.instance().searchQuery.get()) {
      let regex = new RegExp( Template.instance().searchQuery.get(), 'i' );
      let query = { name: regex };
      return Recipes.find(query).fetch();
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
    var holdingName = template.data.toSave;
    if(holdingName == undefined)
      holdingName = "choosenRecipes";

    var id = this._id;
    var currentRecipes = [];
    if(Session.get(holdingName) !== undefined) {
        currentRecipes = Session.get(holdingName);;
    }

    var position = currentRecipes.length;

      currentRecipes.push({
        recipeName: this.name, 
        id: this._id, 
        amount: 0,
        position: position
      });
  
      Session.set(holdingName, currentRecipes);
      $("#searchInput").val("");
    
  }
});