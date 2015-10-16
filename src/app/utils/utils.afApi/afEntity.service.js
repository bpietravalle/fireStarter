(function(angular) {
    "use strict";

    function afEntityService($firebaseObject, $firebaseArray, $firebaseAuth, fbRef) {
        var vm = this;
        vm.set = set;
				vm.wrap = afWrap;

        function setRef(path) {
            return fbRef.ref(path);
        }

        function set(type, path) {

            if (arguments.length === 0) {
                return afWrap('auth', fbRef.root());
            } else if (Array.isArray(path)) {
							//think this should be Object.proto.toString
                return vm.wrap(type, setRef(path));
            } else {
							//in case a firebaseRef comes through
							//wont work for arrays
                return vm.wrap(type,path);
            }
        }

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
