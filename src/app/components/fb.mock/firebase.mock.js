//from angularfire-seed repo - not using currently just wanted for a reference
(function() {
    "use strict";
    angular.module('mock.firebase', [])
        .run(function($window) {
            $window.Firebase = $window.MockFirebase;
        })
        .factory('Firebase', function($window) {
            return $window.MockFirebase;
        });
})();
