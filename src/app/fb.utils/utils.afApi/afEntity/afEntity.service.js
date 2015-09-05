(function(angular) {
    "use strict";

    function afEntityService($firebaseObject, $firebaseArray, $firebaseAuth, fbRef) {
        var entity, ref;
        var vm = this;
        vm.set = set;

        function setRef(path) {
                ref = path;
                if (typeof ref === 'string' || Array.isArray(ref)) {
                    return fbRef.ref(ref);
                } else {
                    //only using this to pass Mockfirebase right now
                    return ref;
                }
            }
            //path arg must be an array of strings or of values 
            //that will respond to toString()

        function set(type, path) {
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
