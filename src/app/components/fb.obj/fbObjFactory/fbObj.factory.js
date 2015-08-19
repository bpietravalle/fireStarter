(function(angular) {
    "use strict";

    function fbEntService($firebaseObject, $firebaseArray, $firebaseAuth, fbutil) {
        var ref = "";
        var entity = "";

        // this.setEntityType = function(type) {
        //     entity = type;
        //     return entity;
        // };
        this.setRef = function(type) {
            ref = type;
            if (ref == null) {
                return fbutil.ref();
            } else {
                return fbutil.ref(ref);
            }
        };
        this.setEntity = function(type, path) {
            entity = this.setRef(path);
            if (type === 'object') {
                return $firebaseObject(entity);
            } else if (type === 'array') {
                return $firebaseArray(entity);
            } else if (type === 'auth') {
                return $firebaseAuth(entity);
            } else if (entity === null) {
                throw new Error('you must call setRef first!');
            } else {
                throw new Error('type must equal "object", "auth", or "array" ');
            }
        };

    }

    fbEntService.$inject = ['$firebaseObject', '$firebaseArray', '$firebaseAuth', 'fbutil'];

    angular.module('fb.obj')
        .service('fbObj', fbEntService);
})(angular);
