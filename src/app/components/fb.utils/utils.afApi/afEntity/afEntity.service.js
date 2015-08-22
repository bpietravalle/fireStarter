(function(angular) {
    "use strict";

    function afEntityService($firebaseObject, $firebaseArray, $firebaseAuth, fbEntity) {
        var ref = "";
        var entity = "";
        //TODO: make setRef private
        //move this to fbRef
        this.setRef = function(path) {
            ref = path;
            if (typeof ref === 'object') {
                return ref;
            } else if (ref == null) {
                return fbEntity.ref();
            } else {
                return fbEntity.ref(ref);
            }
        };
        //TODO: args = (type, obj) --> would rather not have to build
        //ref in the controllers or app level services but easier to test
        //and more explicit;
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
