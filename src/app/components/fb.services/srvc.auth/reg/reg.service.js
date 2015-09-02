(function(angular) {
    "use strict";

    function RegService($q, afEntity, auth) {
        var registration = {
            email: "",
            pass: "",
            confirm: ""
        };

        var authObj = afEntity.set();

        this.passwordAndEmailRegister = function(registration) {
            if (validParams(registration)) {
                var newUser = {
                    email: registration.email,
                    name: ""
                };
                return authObj
                    .$createUser({
                        email: registration.email,
                        password: registration.pass
                    })
                    .then(function(userData) {
                        var creds = {
                            email: registration.email,
                            pass: registration.pass
                        };
                        return auth.passwordAndEmailLogin(creds);
                    })
                    .then(function(authData) {
                        this.getUser(authData);
                    })
                    .then(function(user) {
                            user.$ref().set(newUser);

                        },

                        function(error) {
                            $q.reject(error);

                        });
            } else {
                throw new Error("Please try again - invalid params");
            }
        };


        function validParams(registration) {
            if (!registration.email) {
                console.log("no email");
            } else if (registration.pass !== registration.confirm) {
                console.log("password and email don't match")
            } else if (!registration.pass || !registration.confirm) {
                console.log("please entire a password")
            } else {
                return true;
            }
        };


        this.registerOAuth = function(provider) {
            return auth
                .loginOAuth(provider)
                // need to add scope
                .then(saveOAuthData(authData),

                    function(error) {
                        $q.reject(error);
                    }
                );
        };
        //TODO: write user factory
        this.getUser = function(authData) {
            if (authData) {
                var user = afEntity.set('object', ['users', authData.uid]);
                return user.$loaded();
            } else {
                console.log("no authentication data available");
            }
        };


        function saveOAuthData(authData) {
            if (authData) {
                var newUser = {
                    name: "",
                    email: "",
                };
                if (authData.google) {
                    newUser.email = authData.google.email;
                    newUser.name = authData.google.displayName;
                }
                user.$ref().set(newUser);
            } else {
                console.log("User is logged out");
            }
        }

        this.googleRegister = function() {
            this.registerOAuth("google");
        };
        this.facebookRegister = function() {
            this.registerOAuth("facebook");
        };
        this.twitterRegister = function() {
            this.registerOAuth("twitter");
        };
        this.cancelAccount = function(email, pass) {
            //TODO: deactivate rather than destroy account
            if (auth.isLoggedIn()) {
                authObj.$removeUser({
                    email: email,
                    password: pass
                }).then(function() {
                    session.destroy();
                    console.log("User has been destroyed");
                }, function(error) {
                    $q.reject(error);
                    console.error("Error", error);
                });
            } else {
                throw new Error("no login data found");
            }
        };
    }

    RegService.$inject = ['$q', 'afEntity', 'auth'];

    angular.module('srvc.auth')
        .service('reg', RegService);


})(angular);
