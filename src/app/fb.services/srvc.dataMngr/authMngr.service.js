(function(angular) {
    "use strict";

		/** ngInject */
    function AuthManager(afEntity) {
        var vm = this;

        vm.authWithPassword = authWithPassword;
        vm.authWithOAuthPopup = authWithOAuthPopup;
        vm.changePassword = changePassword;
        vm.changeEmail = changeEmail;
        vm.createUser = createUser;
        vm.currentUID = currentUID;
        vm.getAuth = getAuth;
        vm.removeUser = removeUser;
        vm.resetPassword = resetPassword;
        vm.unauth = unauth;

        vm.authObj = (function() {
					//TODO: use $q.when and add then to below
            return afEntity.set();
        }());

        function authWithPassword(creds) {
            return vm.authObj
                .$authWithPassword({
                    email: creds.email,
                    password: creds.password
                });
        }

        function authWithOAuthPopup(provider) {
            var options = {
                remember: true,
                scope: "email"
            };
            return vm.authObj
                .$authWithOAuthPopup(provider, options);
        }

        function changeEmail(creds) {
            return vm.authObj
                .$changeEmail({
                    oldEmail: creds.oldEmail,
                    newEmail: creds.newEmail,
                    password: creds.password
                });
        }

        function changePassword(creds) {
            return vm.authObj
                .$changePassword({
                    email: creds.email,
                    oldPassword: creds.oldPassword,
                    newPassword: creds.newPassword
                });
        }

        function createUser(creds) {
            return vm.authObj
                .$createUser({
                    email: creds.email,
                    password: creds.password
                });
        }

        function currentUID() {
            if (getAuth() !== null) {
                return getAuth().uid;
            }
        }

        function getAuth() {
            return vm.authObj
                .$getAuth();
        }

        function resetPassword(creds) {
            return vm.authObj
                .$resetPassword({
                    email: creds.email,
                });
        }

        function removeUser(creds) {
            return vm.authObj
                .$removeUser({
                    email: creds.email,
                    password: creds.password
                });
        }

        function unauth() {
            return vm.authObj
                .$unauth();
        }

    }


    angular.module('fb.srvc.dataMngr')
        .service('authMngr', AuthManager);


})(angular);
