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
    var currentRecipes = Session.get('choosenRecipes');
    var id = this._id;
    var existRecipes = currentRecipes.find(function(recipe) {
      return recipe.id == id;
    });
 
    if(!existRecipes || existRecipes.length == 0) {
      currentRecipes.push({recipeName: this.name, id: this._id, amount: 0});
      Session.set('choosenRecipes', currentRecipes);
      $("#searchInput").val("");
    }
  }
});