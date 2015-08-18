(function(angular) {
    "use strict";

    function fbObjFactory($firebaseObject, fbutil) {
        var ref = function(path) {
            if (!path) {
                throw new Error('We can get back to work, once you choose a path for your firebase');
            } else {
                return $firebaseObject(fbutil.ref(path));
            }
        };
				return ref;
    }

    fbObjFactory.$inject = ['$firebaseObject', 'fbutil'];

    angular.module('fb.obj')
        .factory('fbObj', fbObjFactory);

})(angular);
