(function(angular) {
	"use strict";

    function checkAccessOnStateChange($rootScope, $state) {

        $rootScope.$on("$stateChangeError", function(event,
            toState, toParams, fromState, fromParams, error) {
            if (error === "AUTH_REQUIRED") {
                $state.go('home');
            }
        });
    }
    checkAccessOnStateChange.$inject = ['$rootScope', '$state'];
		
		// another take via Jurgen Van de Moere
		// doesn't work - need to add code to account for public pages
		// seems better to stick with #resolve in the router 
    // function checkAccessOnStateChange($rootScope, $state,  auth) {

    //     $rootScope.$on("$stateChangeStart", function(event,
    //         toState, toParams, fromState, fromParams) {
    //         if (!auth.isLoggedIn()) {
		        // //return to login or root path etc
		        // $state.go('home');
		        // //prevent state change
		        // event.preventDefault();
    //         }
    //     });
    // }
    // checkAccessOnStateChange.$inject = ['$rootScope', '$state', 'auth'];


    angular.module("fb")
        .run(checkAccessOnStateChange);
})(angular);
