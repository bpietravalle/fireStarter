(function(angular) {
    "use strict";

    function afEntityService($firebaseObject, $firebaseArray, $firebaseAuth, fbRef) {
        var entity, ref;
        var vm = this;
        vm.set = set;

        function setRef(path) {
					//TODO this fn should only allow arrays and strings
                ref = path;
                if (typeof ref === 'string' || Array.isArray(ref)) {
                    return fbRef.ref(ref);
                } else {
                    //only using this to pass Mockfirebase right now
										//but will work in new objMngr/arrMngr build fns as well
                    return ref;
                }
            }
            //path arg must be an array of strings or of values 
            //that will respond to toString()

        function set(type, path) {
					//TODO: check here if path = fbobject/array
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
