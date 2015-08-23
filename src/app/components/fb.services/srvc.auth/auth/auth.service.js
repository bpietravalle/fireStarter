(function(angular) {
    "use strict";

    function AuthService($q, afEntity, session) {

        var authObj = afEntity.set();

        this.isLoggedIn = function() {
            return session.getAuthData() !== null;
        };
        var creds = {
            email: null,
            pass: null
        };
        var options = {
            remember: null
        };

        this.passwordAndEmailLogin = function(creds, options) {
            return authObj
                .$authWithPassword({
                    email: creds.email,
                    password: creds.pass
                }, {
                    remember: options.remember
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

    AuthService.$inject = ['$q', 'afEntity', 'session'];

    angular.module('srvc.auth')
        .service('auth', AuthService);


})(angular);
