(function(angular) {
    "use strict";

    function sessionService($log, localStorageService) {
        var vm = this;
        vm.getAuthData = getAuthData;
        vm.setAuthData = setAuthData;
        vm.destroy = destroy;
        vm.getAccessToken = getAccessToken;
				vm.getId = getId;
        vm._authData = JSON.parse(localStorageService.get('session.authData'));

        function getAuthData() {
            return vm._authData;
        }

        function setAuthData(authData) {
            vm._authData = authData;
            localStorageService.set('session.authData', JSON.stringify(authData));
            return vm._authData;
        }

        function getAccessToken() {
            if (vm._authData.google) {
                return vm._authData.google.accessToken;
            } else if (vm._authData.twitter) {
                return vm._authData.twitter.accessToken;
            } else {
                return null;
            }
        }

        function destroy() {
            vm.setAuthData(null);
        }

				function getId(){
					return getAuthData();
				}
    }

    sessionService.$inject = ['$log', 'localStorageService'];

    angular.module("fb.srvc.session")
        .service("session", sessionService);


})(angular);
