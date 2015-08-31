(function(angular) {
    "use strict";

    function RegService($q, afEntity, auth) {

        var authObj = afEntity.set();

        this.passwordAndEmailRegister = function(email, pass) {
            return authObj
                .$createUser({
                    email: email,
                    password: pass
                })
                .then(function(userData) {
									
                    return auth.passwordAndEmailLogin(email, pass);
                })
                .then(function(authData) {
                    getUser(authData);
                })
                .then(saveAuthData(authData),

                    function(error) {

                    });
        };


        this.registerOAuth = function(provider) {
            return authObj
                .$authWithOAuthPopup(provider)
                // need to add scope
                .then(function(authData) {
                        session.setAuthData(authData);
                        return authData;
                    },
                    function(error) {
                        $q.reject(error);
                    }
                );
        };

        function getUser(authData) {
            if (authData) {
                var user = afEntity.set('users', authData.uid);
                return user.$loaded()
            } else {
                console.log("no authentication data available");
            }
        }



        function saveAuthData(authData) {
            if (authData.provider === "password") {
                //save data
            } else {
                saveOAuthData(authData);
            };
        }

        //send this to a service to set data...
        //method to save OAuth data
        function saveOAuthData(authData) {
            if (authData) {
                var newUser = {
                    name: "",
                    email: "",
                };
                if (authData.google) {
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
        this.cancelAccount = function() {
            authObj.$unauth();
            session.destroy();
        };
    }

    RegService.$inject = ['$q', 'afEntity', 'auth'];

    angular.module('srvc.auth')
        .service('reg', RegService);


})(angular);
