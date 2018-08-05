AppController = FlowRouter.group({
    triggersEnter: [function(context, redirect) {
        if(!Meteor.userId()) {
            Session.set("loginRedirectContext", "Redirect");
            redirect('/');
        }

    }]
});

FlowRouter.route('/', {
    name: 'home',
    action() {
        BlazeLayout.render("HomeLayout", {main: "Home"});
    }
});

FlowRouter.route('/logout', {
  name: 'logout',
  action() {
    Accounts.logout();
    FlowRouter.redirect('/');
  }
});

AppController.route('/products', {
    name: 'home',
    action() {
        BlazeLayout.render("HomeLayout", {main: "Products"});
    }
});

AppController.route('/recipes', {
    name: 'home',
    action() {
        BlazeLayout.render("HomeLayout", {main: "Recipes"});
    }
});

AppController.route('/new-recipe', {
    name: 'home',
    action() {
        BlazeLayout.render("HomeLayout", {main: "NewRecipes"});
    }
});

AppController.route('/menu', {
    name: 'home',
    action() {
        BlazeLayout.render("HomeLayout", {main: "Menu"});
    }
});