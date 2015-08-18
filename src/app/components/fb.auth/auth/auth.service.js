(function(angular) {
    "use strict";

    function AuthService($q, fbAuth, session, fbutil) {

        var authObj = fbAuth;

        this.isLoggedIn = function() {
            return session.getAuthData() !== null;
        };

        this.passwordAndEmailLogin = function(email, pass) {
            return authObj
                .$authWithPassword({
                    email: email,
                    password: pass
                })
                .then(function(authData) {
                        session.setAuthData(authData);
                        return authData;
                    },
                    function(error) {
                        $q.reject(error);
                    }
                );
        };

        this.passwordAndEmailRegister = function(email, pass) {
            console.log("message received with " + email + " and" + pass);
            return authObj
                .$createUser({
                    email: email,
                    password: pass
                })
                .then(function(userData) {
                    console.log("user " + userData.uid + " created");
                    AuthService.passwordAndEmailLogin(email, pass);
                    // return authObj
                    //     .$authWithPassword({
                    //         email: email,
                    //         password: pass
                    //     });
                })
                .then(function(userData) {
                        var ref = fbutil.ref('users', userData.uid);
                        return fbutil.handler(function(cb) {
                            ref.set({
                                email: email,
                                name: 'big dawg'
                            }, cb);
                        });
                    },

                    // console.log("User " + userData.uid + " created successfully");
                    // this.passwordAndEmailLogin(email, pass);
                    // console.log("authdata = " + authData ", and session =" + session);
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

    AuthService.$inject = ['$q', 'fbAuth', 'session', 'fbutil'];

    angular.module('fb.auth')
        .service('auth', AuthService);


})(angular);
