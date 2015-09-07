(function(angular) {
    "use strict";

    function AuthService($q, $log, afEntity, session, user) {
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
                    password: creds.password
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

        //this doesn't return a promise apparently
        function googleLogin() {
            return vm.loginOAuth("google");
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
                    password: creds.password
                })
                .then(function() {
                        $log.info("email successfully changed");
                    },
                    function(error) {
                        $q.reject(error);
                    });
        }

        function saveUser(obj, ch) {
            if (obj, ch) {
                obj.email = ch.email;
                return user.save(obj);
            } else {
                $log.info("no user obj");
            }
        }

        function getUser() {
            var s = session.getAuthData();
            var id = s.uid;

            if (id) {
                return user.findById(id);
            } else {
                $log.info("no authentication data available");
            }
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
            if (validParams(creds)) {
                return vm.authObj
                    .$changePassword({
                        email: creds.email,
                        oldPassword: creds.oldPassword,
                        newPassword: creds.newPassword
                    })
                    .then(function() {
                            $log.info("password successfully changed");
                        },
                        function(error) {
                            $q.reject(error);
                        });
            } else {
                throw new Error("Invalid Params.  see: " + creds)
            }

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

    AuthService.$inject = ['$q', '$log', 'afEntity', 'session', 'user'];

    angular.module('fb.srvc.auth')
        .service('auth', AuthService);


})(angular);
