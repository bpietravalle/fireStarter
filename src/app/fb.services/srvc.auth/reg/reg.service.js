(function(angular) {
    "use strict";

    function RegService($q, $log, user, auth) {
        var vm = this;
        vm.passwordAndEmailRegister = passwordAndEmailRegister;
        vm.registerOAuth = registerOAuth;
        vm.googleRegister = googleRegister;
        vm.facebookRegister = facebookRegister;
        vm.twitterRegister = twitterRegister;
        vm.cancelAccount = cancelAccount;

        function passwordAndEmailRegister(registration) {
            if (validParams(registration)) {
                //TODO: move second promise? userData obj isnt being used
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
                                name: firstPartOfEmail(registration.email)
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
        }


        function validParams(registration) {
            //TODO: these should throw errors
            if (!registration.email) {
                $log.info("no email");
            } else if (registration.pass !== registration.confirm) {
                $log.info("password and email don't match");
            } else if (!registration.pass || !registration.confirm) {
                $log.info("please entire a password");
            } else {
                return true;
            }
        }


        function registerOAuth(provider) {
            return auth
                .loginOAuth(provider)
                // need to add scope
                .then(function(authData) {
                    saveUser(getUser(authData.uid),
                        saveOAuthData(authData));

                }, function(error) {
                    $q.reject(error);
                });
        }

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

        function googleRegister() {
            vm.registerOAuth("google");
        }

        function facebookRegister() {
            vm.registerOAuth("facebook");
        }

        function twitterRegister() {
            vm.registerOAuth("twitter");
        }

        function cancelAccount(credentials) {
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
        }

        //these 2 functions are from angularfire seed repo
        function firstPartOfEmail(email) {
            return ucfirst(email.substr(0, email.indexOf('@')) || '');
        }

        function ucfirst(str) {
            str += '';
            var f = str.charAt(0).toUpperCase();
            return f + str.substr(1);
        }
    }

    RegService.$inject = ['$q', '$log', 'user', 'auth'];

    angular.module('fb.srvc.auth')
        .service('reg', RegService);


})(angular);
