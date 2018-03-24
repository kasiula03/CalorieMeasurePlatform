Template.search.onCreated( () => {
  let template = Template.instance();

  template.searchQuery = new ReactiveVar();
  template.searching   = new ReactiveVar( false );

});

Template.search.helpers({
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
      return Products.find(query).fetch();
    } else {
      return null;
    }
  }
});

Template.search.events({
  'keyup [name="search"]': function ( event, template ) {
    let value = event.target.value.trim();
    let regex = new RegExp( value, 'i' );
    let query = { name: regex };
    Template.instance().searchQuery.set(value);
  },
  'click .product': function (event, template) {
    var currentProducts = Session.get('choosenProducts');
    var id = this._id;
    var existProduct = currentProducts.find(function(product) {
      return product.id == id;
    });
 
    if(!existProduct || existProduct.length == 0) {
      currentProducts.push({name: this.name, weight: 0, id: this._id});
      Session.set('choosenProducts', currentProducts);
      $("#searchInput").val("");
    }
    
  }
});