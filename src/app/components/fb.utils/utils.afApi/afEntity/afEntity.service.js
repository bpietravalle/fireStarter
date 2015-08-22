(function(angular) {
    "use strict";

    function afEntityService($firebaseObject, $firebaseArray, $firebaseAuth, fbRef) {
        var ref = "";
        var entity = "";
        //move this to fbRef
        this.setRef = function(path) {
            ref = path;
            if (typeof ref === 'object') {
                return ref;
            } else if (ref == null) {
                return fbRef.ref();
            } else {
                return fbRef.ref(ref);
            }
        };
        this.set = function(type, path) {
            if (arguments.length === 0) {
                return afWrap('auth', fbRef.root());
            } else {
                entity = this.setRef(path);
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
