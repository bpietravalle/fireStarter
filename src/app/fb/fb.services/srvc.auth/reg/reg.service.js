(function(angular) {
    "use strict";

    function RegService($q, $log, user, auth) {

        this.passwordAndEmailRegister = function(registration) {
					var newUser;
            if (validParams(registration)) {
                return auth.authObj
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
                        return getUser(authData);
                    })
                    .then(function(data) {
                            // data.email = registration.email;
                            // data.name = "";
                            // return data.$save();
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
                $log.info("no email");
            } else if (registration.pass !== registration.confirm) {
                $log.info("password and email don't match")
            } else if (!registration.pass || !registration.confirm) {
                $log.info("please entire a password")
            } else {
                return true;
            }
        };


        this.registerOAuth = function(provider) {
            return auth
                .loginOAuth(provider)
                // need to add scope
                .then(function(authData) {
                    getUser(authData)
                })
                .then(saveOAuthData(user),

                    function(error) {
                        $q.reject(error);
                    }
                );
        };

        function getUser(authData) {
            if (authData) {
                return user.findById(authData);
            } else {
                $log.info("no authentication data available");
            }
        }


        function saveOAuthData(user) {
            var newUser = {
                name: "",
                email: ""
            };
            if (authData.google) {
                newUser.email = authData.google.email;
                newUser.name = authData.google.displayName;
            }
            user.$ref().set(newUser);

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
                auth.authObj
                    .$removeUser({
                        email: email,
                        password: pass
                    }).then(function() {
                        session.destroy();
                        $log.info("User has been destroyed");
                    }, function(error) {
                        $q.reject(error);
                        $log.error("Error", error);
                    });
            } else {
                throw new Error("no login data found");
            }
        };
    }

    RegService.$inject = ['$q', '$log', 'user', 'auth'];

    angular.module('srvc.auth')
        .service('reg', RegService);


})(angular);
