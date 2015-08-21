(function(angular) {
    "use strict";

    function afEntityService($firebaseObject, $firebaseArray, $firebaseAuth, fbEntity) {
        var ref = "";
        var entity = "";
        //TODO: make setRef private
        this.setRef = function(type) {
            ref = type;
            if (ref == null) {
                return fbEntity.ref();
            } else {
                return fbEntity.ref(ref);
            }
        };
        this.set = function(type, path) {
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

    afEntityService.$inject = ['$firebaseObject', '$firebaseArray', '$firebaseAuth', 'fbEntity'];

    angular.module('utils.afApi')
        .service('afEntity', afEntityService);
})(angular);
