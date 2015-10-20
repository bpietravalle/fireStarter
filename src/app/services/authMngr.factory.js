(function() {
    "use strict";
    var AuthMngr;

    angular.module('fireStarter.services')
        .factory('authMngr', AuthMngrFactory);

    /** @ngInject */
    function AuthMngrFactory($timeout, baseBuilder, $q, $log) {

        return function() {
            var fb = new AuthMngr($timeout, baseBuilder, $q, $log);
            return fb.construct();
        };
    }

    AuthMngr = function($timeout, baseBuilder, $q, $log) {
        this._timeout = $timeout;
        this._q = $q;
        this._baseBuilder = baseBuilder;
        this._log = $log;
        this._firebaseAuth = this._baseBuilder.set("auth");
    };

    AuthMngr.prototype = {
        construct: function() {
            var self = this;
            var auth = {};

            auth.authWithPassword = authWithPassword;
            auth.authWithOAuthPopup = authWithOAuthPopup;
            auth.changePassword = changePassword;
            auth.changeEmail = changeEmail;
            auth.createUser = createUser;
            auth.currentUID = currentUID;
            auth.getAuth = getAuth;
            auth.removeUser = removeUser;
            auth.requireAuth = requireAuth;
            auth.resetPassword = resetPassword;
            auth.unauth = unauth;

            function authWithPassword(creds) {
                // return self._firebaseAuth
                //     .then(completeAction)

                // function completeAction(res) {
                var deferred = self._q.defer();
                self._timeout(function() {
                    self._firebaseAuth.$authWithPassword({
                            email: creds.email,
                            password: creds.password
                        })
                        .then(function(res) {
                            deferred.resolve(res);
                        }).catch(function(err) {
                            deferred.reject(err);
                        });
                });
                self._log.info(deferred.promise);
                return deferred.promise;
            }



            function authWithOAuthPopup(provider) {
                var options = {
                    remember: true,
                    scope: "email"
                };
                return self._firebaseAuth
                    .then(completeAction)
                    .catch(standardError);

                function completeAction(res) {
                    return res.$authWithOAuthPopup(provider, options);
                }
            }

            function changeEmail(creds) {
                return self._firebaseAuth
                    .then(completeAction)
                    .catch(standardError);

                function completeAction(res) {
                    return res.$changeEmail({
                        oldEmail: creds.oldEmail,
                        newEmail: creds.newEmail,
                        password: creds.password
                    });
                }
            }

            function changePassword(creds) {
                return self._firebaseAuth
                    .then(completeAction)
                    .catch(standardError);

                function completeAction(res) {
                    return res.$changePassword({
                        email: creds.email,
                        oldPassword: creds.oldPassword,
                        newPassword: creds.newPassword
                    });
                }
            }

            function createUser(creds) {
                return self._firebaseAuth
                    .then(completeAction)
                    .catch(standardError);

                function completeAction(res) {
                    return res.$createUser({
                        email: creds.email,
                        password: creds.password
                    });
                }
            }

            function currentUID() {
                if (getAuth() !== null) {
                    return getAuth().uid;
                }
            }

            function getAuth() {
                return self._firebaseAuth
                    .then(completeAction)
                    .catch(standardError);

                function completeAction(res) {
                    return res.$getAuth();
                }
            }

            function removeUser(creds) {
                return self._firebaseAuth
                    .then(completeAction)
                    .catch(standardError);

                function completeAction(res) {
                    return res.$removeUser({
                        email: creds.email,
                        password: creds.password
                    });
                }
            }

            function requireAuth() {
                return self._firebaseAuth
                    .then(completeAction)
                    .catch(standardError);

                function completeAction(res) {
                    return res.$requireAuth();
                }
            }

            function resetPassword(creds) {
                return self._firebaseAuth
                    .then(completeAction)
                    .catch(standardError);

                function completeAction(res) {
                    return res.$resetPassword({
                        email: creds.email,
                    });
                }
            }


            function unauth() {
                return self._firebaseAuth
                    .then(completeAction)
                    .catch(standardError);

                function completeAction(res) {
                    return res.$unauth();
                }
            }

            function standardError(err) {
                return self._q.reject(err);
            }

            self._auth = auth;
            return self._auth;
        }


    };


}.call(this));
