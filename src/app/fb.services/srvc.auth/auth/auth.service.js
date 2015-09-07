(function(angular) {
    "use strict";

    function AuthService($q, $log, afEntity, session) {
        var vm = this;

        vm.isLoggedIn = isLoggedIn;
        vm.passwordAndEmailLogin = passwordAndEmailLogin;
        vm.loginOAuth = loginOAuth;
        vm.googleLogin = googleLogin;
        vm.facebookLogin = facebookLogin;
        vm.twitterLogin = twitterLogin;
        vm.logOut = logOut;
        vm.changeEmail = changeEmail;
        vm.resetPassword = resetPassword;
        vm.changePassword = changePassword;

        vm.authObj = (function() {
            return afEntity.set();
        }());

        function isLoggedIn() {
            return session.getAuthData() !== null;
        }

        function passwordAndEmailLogin(creds) {
            return vm.authObj
                .$authWithPassword({
                    email: creds.email,
                    password: creds.pass
                })
                .then(function(authData) {
                        session.setAuthData(authData);
                        return authData;
                    },
                    function(error) {
                        $q.reject(error);
                    }
                );
        }

        function loginOAuth(provider) {
            return vm.authObj
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
        }

        function googleLogin() {
            vm.loginOAuth("google");
        }

        function facebookLogin() {
            vm.loginOAuth("facebook");
        }

        function twitterLogin() {
            vm.loginOAuth("twitter");
        }

        function logOut() {
            if (vm.isLoggedIn()) {
                vm.authObj
                    .$unauth();
                session.destroy();
            } else {
                throw new Error("no login data found");
            }
        }

        function changeEmail(creds) {
            return vm.authObj
                .$changeEmail({
                    oldEmail: creds.oldEmail,
                    newEmail: creds.newEmail,
                    password: creds.pass
                })
                .then(function() {
                        $log.info("email successfully changed");
                    },
                    function(error) {
                        $q.reject(error);
                    });
        }

        function resetPassword(creds) {
            return vm.authObj
                .$resetPassword({
                    email: creds.email,
                })
                .then(function() {
                        $log.info("password reset email sent");
                    },
                    function(error) {
                        $q.reject(error);
                    });
        }

        function changePassword(creds) {
            return vm.authObj
                .$changePassword({
                    email: creds.email,
                    oldPassword: creds.oldPassword,
                    newPassword: creds.newPassword
                })
                .then(function() {
                        $log.info("password change email sent");
                    },
                    function(error) {
                        $q.reject(error);
                    });
        }

    }

    AuthService.$inject = ['$q', '$log', 'afEntity', 'session'];

    angular.module('fb.srvc.auth')
        .service('auth', AuthService);


})(angular);
