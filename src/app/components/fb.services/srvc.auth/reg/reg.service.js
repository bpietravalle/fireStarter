(function(angular) {

    "use strict";

    function RegService($q, afEntity, auth, fbEntity) {

        var authObj = afEntity.set();

        this.passwordAndEmailRegister = function(email, pass) {
            console.log("message received with " + email + " and" + pass);
            return authObj
                .$createUser({
                    email: email,
                    password: pass
                })
                .then(function(userData) {
                    console.log("user " + userData.uid + " created");
                        auth.passwordAndEmailLogin(email, pass);
                    // return authObj
                    //     .$authWithPassword({
                    //         email: email,
                    //         password: pass
                    //     });
                })
                .then(function(authData) {
                        var ref = fbEntity.ref('users', authData.uid);
                        return fbEntity.handler(function(cb) {
                            ref.set({
                                email: email,
                                name: 'big dawg'
                            }, cb);
                        });
                    },
                    function(error) {
                        $q.reject(error);
                    }
                );
        };

        this.loginOAuth = function(provider) {
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

        this.googleLogin = function() {
            this.loginOAuth("google");
        };
        this.facebookLogin = function() {
            this.loginOAuth("facebook");
        };
        this.twitterLogin = function() {
            this.loginOAuth("twitter");
        };
        this.logOut = function() {
            authObj.$unauth();
            session.destroy();
        };
    }

    RegService.$inject = ['$q', 'afEntity', 'auth', 'fbEntity'];

    angular.module('srvc.auth')
        .service('reg', RegService);


})(angular);
