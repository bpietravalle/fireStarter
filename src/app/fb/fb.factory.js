(function(angular) {
    "use strict";

    function fbFactory($firebaseAuth, fbutil) {
        return $firebaseAuth(fbutil.ref());
    }

    fbFactory.$inject = ['$firebaseAuth', 'fbutil'];

    angular.module('fb')
        .factory('Fb', fbFactory);

})(angular);
