FlowRouter.route('/', {
    name: 'home',
    action() {
        BlazeLayout.render("HomeLayout", {main: "Home"});
    }
});

FlowRouter.route('/products', {
    name: 'home',
    action() {
        BlazeLayout.render("HomeLayout", {main: "Products"});
    }
});

FlowRouter.route('/recipes', {
    name: 'home',
    action() {
        BlazeLayout.render("HomeLayout", {main: "Recipes"});
    }
});

FlowRouter.route('/new-recipe', {
    name: 'home',
    action() {
        BlazeLayout.render("HomeLayout", {main: "NewRecipes"});
    }
});

FlowRouter.route('/menu', {
    name: 'home',
    action() {
        BlazeLayout.render("HomeLayout", {main: "Menu"});
    }
});