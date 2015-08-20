(function(angular) {
    "use strict";

    function sessionService($log, localStorageService) {

        this._authData = JSON.parse(localStorageService.get('session.authData'));

        this.getAuthData = function() {
            return this._authData;

        };

        this.setAuthData = function(authData) {
            this._authData = authData;
            localStorageService.set('session.authData', JSON.stringify(authData));
            return this;
        };

        this.getGoogleAccessToken = function() {
            if (this._authData && this._authData.google && this._authData.accessToken) {
                return this._authData.google.accessToken;
            }

            return null;
        };

        this.destroy = function destroy() {
            this.setAuthData(null);
        };
    }

    sessionService.$inject = ['$log', 'localStorageService'];

    angular.module("srvc.session")
        .service("session", sessionService);


})(angular);
