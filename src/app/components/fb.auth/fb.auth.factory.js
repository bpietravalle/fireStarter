(function(angular) {
    "use strict";

    function fbAuthFactory($firebaseAuth, fbUtils) {
        return $firebaseAuth(fbutil.ref());
    }

    fbAuthFactory.$inject = ['$firebaseAuth', 'fbUtils'];

    angular.module('fb.auth')
        .factory('Fb', fbAuthFactory);

})(angular);
