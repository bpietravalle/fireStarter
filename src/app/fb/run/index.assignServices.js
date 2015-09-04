(function(angular) {
	"use strict";

    function assignServicesToRootScope($rootScope, auth, session) {

        $rootScope.auth = auth;
        $rootScope.session = session;

    }

    assignServicesToRootScope.$inject = ['$rootScope', 'auth', 'session'];


    angular.module("fb")
        .run(assignServicesToRootScope);
})(angular);
