(function(angular) {
    "use strict";

    function fbAuthFactory($firebaseAuth, fbutil) {
        return $firebaseAuth(fbutil.ref());
    }

    fbAuthFactory.$inject = ['$firebaseAuth', 'fbutil'];

    angular.module('fb.auth')
        .factory('fbAuth', fbAuthFactory);

})(angular);
