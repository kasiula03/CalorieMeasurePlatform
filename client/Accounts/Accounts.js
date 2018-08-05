T9n.setLanguage("pl");

AccountsTemplates.removeField('password');
AccountsTemplates.removeField('email');

AccountsTemplates.addFields([
	{
      _id: "username",
      type: "text",
      displayName: "Nazwa użytkownika",
      placeholder: "Nazwa użytkownika",
      required: true,
      minLength: 5,
  	},
	{
	    _id: 'email',
	    type: 'email',
	    required: true,
	    displayName: "email",
	    placeholder: "email",
	    re: /.+@(.+){2,}\.(.+){2,}/,
	    errStr: 'Invalid email',
	},
	{
    	_id: 'username_and_email',
    	type: 'text',
    	required: true,
    	displayName: "Email",
    	placeholder: "Email"
 	},
	{
	    _id: 'password',
	    type: 'password',
	    displayName: "Hasło",
	    placeholder: "Hasło",
	    required: true,
	    minLength: 6,
	    re: /(?=.*[a-z])(?=.*[A-Z]).{6,}/,
	    errStr: 'At least 1 lower-case and 1 upper-case'
	},
	{
		_id: 'password_again',
		type: 'password',
		displayName: "Hasło (ponownie)",
		placeholder: "Hasło (ponownie)",
		required: true,
		errStr: 'Hasła nie są identyczne!'
	}

]);

var hideErrorMsg = function(error, state){
  if (!error) {
    if (state === "signIn" || state === "signUp") {
    	Session.set("loginRedirectContext", false);
    }
  }
};

AccountsTemplates.configure({
	onSubmitHook: hideErrorMsg,
	homeRoutePath: '/',
	texts: {
		sep: "lub",
		socialSignUp: "Zarejestruj się",
		socialSignIn: "Zaloguj się",
		socialWith: "przez",
		button: {
			signUp: "Zarejestruj się!",
			signIn: "Zaloguj się"
		},
		title: {
			signIn: "Panel logowania",
			signUp: "Rejestracja"
		},
		errors: {
      		accountsCreationDisabled: "Client side accounts creation is disabled!!!",
            cannotRemoveService: "Cannot remove the only active service!",
            captchaVerification: "Captcha verification failed!",
            loginForbidden: "error.accounts.Login forbidden",
            mustBeLoggedIn: "error.accounts.Must be logged in",
            pwdMismatch: "error.pwdsDontMatch",
            validationErrors: "Validation Errors",
            verifyEmailFirst: "Please verify your email first. Check the email and follow the link!"
    	},
		signInLink_pre: "Jeżeli masz już konto ",
		signInLink_link: "zaloguj się",
		signUpLink_pre: "Nie masz swojego konta? ",
		signUpLink_link: "zarejestruj się"
	}

});

AccountsTemplates.knownRoutes.push('logout');