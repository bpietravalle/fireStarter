(function(angular) {
    "use strict";

    function RegService($q, $log, user, auth) {

        this.passwordAndEmailRegister = function(registration) {
            if (validParams(registration)) {

                return auth.authObj
                    .$createUser({
                        email: registration.email,
                        password: registration.pass
                    })
                    .then(function(userData) {
                        var creds = {
                            email: registration.email,
                            password: registration.pass
                        };
                        return auth.passwordAndEmailLogin(creds);
                    })
                    .then(function(authData) {
                            var newUser = {
                                email: registration.email,
                                name: ""
                            };
                            return saveUser(
                                getUser(authData.uid), newUser);
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
                    saveUser(getUser(authData.uid),
                        saveOAuthData(authData));

                }, function(error) {
                    $q.reject(error);
                });
        };

        function getUser(id) {
            if (id) {
                return user.findById(id);
            } else {
                $log.info("no authentication data available");
            }
        }

        function saveUser(obj, ch) {
            if (obj, ch) {
                obj.email = ch.email;
                obj.name = ch.name;
                return user.save(obj);
            } else {
                $log.info("no user obj");
            }
        }


        function saveOAuthData(authData) {
            var newUser = {
                name: "",
                email: ""
            };
            if (authData.google) {
                newUser.email = authData.google.email;
                newUser.name = authData.google.displayName;
            }
            return newUser;
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
        this.cancelAccount = function(credentials) {
            //TODO: deactivate rather than destroy account
            if (auth.isLoggedIn()) {
                auth.authObj
                    .$removeUser({
                        email: credentials.email,
                        password: credentials.password
                    }).then(function() {
                        auth.logOut();
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
