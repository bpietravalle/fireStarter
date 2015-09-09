(function(angular) {
    "use strict";

    function AuthService($q, $log, authMngr, session, user) {
        var vm = this;

        vm.changeEmail = changeEmail;
        vm.changePassword = changePassword;
        vm.facebookLogin = facebookLogin;
        vm.googleLogin = googleLogin;
        vm.isLoggedIn = isLoggedIn;
        vm.loginOAuth = loginOAuth;
        vm.logOut = logOut;
        vm.passwordAndEmailLogin = passwordAndEmailLogin;
        vm.resetPassword = resetPassword;
        vm.twitterLogin = twitterLogin;

        function changeEmail(creds) {
            var newEmail = creds.newEmail;

            return authMngr
                .changeEmail({
                    oldEmail: creds.oldEmail,
                    newEmail: creds.newEmail,
                    password: creds.password
                })
                .then(function() {
                    return changeEmailSuccess(newEmail);
                }, changeEmailFailure);
        }

        function changePassword(creds) {
            if (validParams(creds)) {
                return authMngr
                    .changePassword({
                        email: creds.email,
                        oldPassword: creds.oldPassword,
                        newPassword: creds.newPassword
                    })
                    .then(changePasswordSuccess,
                        changePasswordFailure);
            } else {
                throw new Error("Invalid Params.  see: " + creds)
            }

        }

        function googleLogin() {
            return vm.loginOAuth("google");
        }

        function facebookLogin() {
            return vm.loginOAuth("facebook");
        }

        function isLoggedIn() {
            return session.getAuthData() !== null;
        }

        function loginOAuth(provider) {
            return authMngr
                .authWithOAuthPopup(provider)
                // need to add scope parameter
                .then(loginOAuthSuccess,
                    loginOAuthFailure);
        }


        function logOut() {
            if (vm.isLoggedIn()) {
                authMngr
                    .unauth();
                session.destroy();
            } else {
                throw new Error("no login data found");
            }
        }

        function passwordAndEmailLogin(creds) {
            return authMngr
                .authWithPassword({
                    email: creds.email,
                    password: creds.password
                })
                .then(passAndEmailLoginSuccess,
                    passAndEmailLoginFailure);
        }

        function resetPassword(creds) {
            return authMngr
                .resetPassword({
                    email: creds.email,
                })
                .then(resetPasswordSuccess,
                    resetPasswordFailure);
        }

        function twitterLogin() {
            return vm.loginOAuth("twitter");
        }

        //Handling Resolved Promises

        function passAndEmailLoginSuccess(response) {
            return setSession(response);
        }

        function loginOAuthSuccess(response) {
            return setSession(response);
        }

        function changeEmailSuccess(email) {
            return saveEmail(email);
            //TODO handle promise returned by user.save
            // .then(function() {
            //     $log.info("email successfully changed and updated in firebase");
            // }, function() {
            //     $log.error("there was an error updating firebase")
            // });
        }

        function resetPasswordSuccess() {
            $log.info("password reset email sent");
        };

        function changePasswordSuccess() {
            $log.info("password successfully changed");
        };

        // Handling Rejected Promises

        function authFailure(error) {
            $log.error(error);
            return $q.reject(error);
        }

        function passAndEmailLoginFailure(error) {
            return authFailure(error);
        }

        function loginOAuthFailure(error) {
            return authFailure(error);
        }

        function changeEmailFailure(error) {
            return authFailure(error);
        }

        function resetPasswordFailure(error) {
            return authFailure(error);
        };

        function changePasswordFailure(error) {
            return authFailure(error);
        };


        // Helper functions

        function saveEmail(email) {

            var obj = getUser();
            if (obj) {
                obj.email = email;
                return user.save(obj);
            } else {
                $log.error("no user obj");
            }
        }

        function getUser() {
            var id = authMngr
                .currentUID();
            if (id !== null) {
                return user.findById(id);
            } else {
                $log.error("no authentication data available");
            }
        }

        function setSession(response) {
            $log.info("session data set: " + response);
            return session.setAuthData(response);
        }


        function validParams(creds) {
            //TODO: these should throw errors
            if (!creds.email || !creds.confirm || !creds.newPassword || !creds.oldPassword) {
                $log.info("Please fill in all the password fields");
            } else if (creds.newPassword !== creds.confirm) {
                $log.info("password and confirmation don't match");
            } else {
                return true;
            }
        }


    }

    AuthService.$inject = ['$q', '$log', 'authMngr', 'session', 'user'];

    angular.module('fb.srvc.auth')
        .service('auth', AuthService);


})(angular);
