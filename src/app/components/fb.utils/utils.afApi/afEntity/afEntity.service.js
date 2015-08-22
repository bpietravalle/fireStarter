(function(angular) {
    "use strict";

    function afEntityService($firebaseObject, $firebaseArray, $firebaseAuth, fbRef) {
        var ref = "";
        var entity = "";
        function setRef(path) {
            ref = path;
            if (typeof ref === 'string' || Array.isArray(ref)) {
                return fbRef.ref(ref);
            } else {
                return ref;
            }
        };
        this.set = function(type, path) {
            if (arguments.length === 0) {
                return afWrap('auth', fbRef.root());
            } else {
                entity = setRef(path);
                return afWrap(type, entity);
            }
        };

        function afWrap(type, entity) {
            if (type === 'object') {
                return $firebaseObject(entity);
            } else if (type === 'array') {
                return $firebaseArray(entity);
            } else if (type === 'auth') {
                return $firebaseAuth(entity);
            }
        }
    }

    afEntityService.$inject = ['$firebaseObject', '$firebaseArray', '$firebaseAuth', 'fbRef'];

    angular.module('utils.afApi')
        .service('afEntity', afEntityService);
})(angular);
