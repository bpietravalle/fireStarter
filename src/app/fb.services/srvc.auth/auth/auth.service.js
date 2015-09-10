(function(angular) {
    "use strict";

    function AuthService($q, $log, authMngr, session, user) {
        var vm = this;

        vm.cancelAccount = cancelAccount;
        vm.changeEmail = changeEmail;
        vm.changePassword = changePassword;
        vm.facebookLogin = facebookLogin;
        vm.facebookRegister = facebookRegister;
        vm.googleLogin = googleLogin;
        vm.googleRegister = googleRegister;
        vm.isLoggedIn = isLoggedIn;
        vm.loginOAuth = loginOAuth;
        vm.logOut = logOut;
        vm.passwordAndEmailLogin = passwordAndEmailLogin;
        vm.passwordAndEmailRegister = passwordAndEmailRegister;
        vm.registerOAuth = registerOAuth;
        vm.resetPassword = resetPassword;
        vm.twitterLogin = twitterLogin;
        vm.twitterRegister = twitterRegister;

        function cancelAccount(credentials) {
            //TODO: deactivate rather than destroy account
            if (vm.isLoggedIn()) {
                authMngr
                    .removeUser({
                        email: credentials.email,
                        password: credentials.password
                    }).then(function() {
                        vm.logOut();
                        $log.info("User has been destroyed");
                    }, function(error) {
                        $q.reject(error);
                        $log.error("Error", error);
                    });
            } else {
                throw new Error("no login data found");
            }
        }


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
                })
                .then(function(ref) {
                    $log.info("Successfully updated at: " + ref);
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

        function googleRegister() {
            vm.registerOAuth("google");
        }

        function facebookLogin() {
            return vm.loginOAuth("facebook");
        }

        function facebookRegister() {
            vm.registerOAuth("facebook");
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

        function passwordAndEmailRegister(registration) {
            if (validRegParams(registration)) {
                return authMngr
                    .createUser({
                        email: registration.email,
                        password: registration.password
                    })
                    .then(function() {
                        var creds = {
                            email: registration.email,
                            password: registration.password
                        };
                        return vm.passwordAndEmailLogin(creds);

                    })
                    .then(function() {
                        var newUser = {
                            email: registration.email,
                            name: firstPartOfEmail(registration.email)
                        };
                        return saveUser(newUser);
                    })
                    .then(function(ref) {
                        $log.info("Successfully updated at: " + ref);
                    }, passAndEmailRegisterFailure);

            } else {
                throw new Error("Please try again - invalid params.  See: " + registration);
            }
        }

        function registerOAuth(provider) {
            return vm
                .loginOAuth(provider)
                // need to add scope
                .then(function(authData) {
                    return saveUser(
                        saveOAuthData(authData));
                })
                .then(function(ref) {
                    $log.info("Successfully updated at: " + ref);
                }, registerOAuthFailure)
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

        function twitterRegister() {
            vm.registerOAuth("twitter");
        }

        //Handling Resolved Promises

        function passAndEmailLoginSuccess(response) {
            return setSession(response);
        }

        function loginOAuthSuccess(response) {
            return setSession(response);
        }

        function changeEmailSuccess(email) {
            return saveEmail(email)
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

        function passAndEmailRegisterFailure(error) {
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

        function registerOAuthFailure(error) {
            return authFailure(error);
        }

        function changePasswordFailure(error) {
            return authFailure(error);
        };


        // Helper functions

        //these 2 functions are from angularfire seed repo
        function firstPartOfEmail(email) {
            return ucfirst(email.substr(0, email.indexOf('@')) || '');
        }

        function ucfirst(str) {
            str += '';
            var f = str.charAt(0).toUpperCase();
            return f + str.substr(1);
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

        function saveEmail(email) {

            var obj = getUser();
            if (obj) {
                obj.email = email;
                return user.save(obj);
            } else {
                $log.error("no user obj");
            }
        }

        function saveUser(u) {
            var obj = getUser();
            if (obj) {
                obj.email = u.email;
                obj.name = u.name;
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

        function validRegParams(registration) {
            //TODO: these should throw errors
            if (!registration.email) {
                $log.info("no email");
            } else if (registration.password !== registration.confirm) {
                $log.info("password and email don't match");
            } else if (!registration.password || !registration.confirm) {
                $log.info("please entire a password");
            } else {
                return true;
            }
        }


    }

    AuthService.$inject = ['$q', '$log', 'authMngr', 'session', 'user'];

    angular.module('fb.srvc.auth')
        .service('auth', AuthService);


})(angular);
