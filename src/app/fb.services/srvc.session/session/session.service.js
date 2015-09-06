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

        this.getAccessToken = function() {
            if (this._authData.google) {
                return this._authData.google.accessToken;
            } else if (this._authData.twitter) {
                return this._authData.twitter.accessToken;
            } else {
                return null;
            }
        };

        this.destroy = function destroy() {
            this.setAuthData(null);
        };
    }

    sessionService.$inject = ['$log', 'localStorageService'];

    angular.module("srvc.session")
        .service("session", sessionService);


})(angular);
