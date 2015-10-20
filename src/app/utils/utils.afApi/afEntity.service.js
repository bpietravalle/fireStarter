(function(angular) {
    "use strict";
    //change to factory

    /** @ngInject */

    function afEntityService($timeout, $q, $firebaseObject, $firebaseArray, $firebaseAuth, fbRef) {
        var vm = this;
        vm.set = set;
        vm.wrap = afWrap;
        vm.build = build;


        function build(type, path, flag) {
            var deferred = $q.defer();
            $timeout(function() {
                $q.when(set(type, path, flag)).then(function(result) {
                    deferred.resolve(result);
                }).catch(function(error) {
                    deferred.reject(error);
                });
            });
            return deferred.promise;
        }

        function set(type, path, flag) {
            if (type === 'auth') {
                return afWrap('auth', fbRef.root());
            } else if (flag === true) {
                return afWrap(type, path);
            } else {
                return afWrap(type, setRef(path));
            }
        }

        function setRef(path) {
            return fbRef.ref(path);
        }

        function afWrap(type, entity) {
            if (type === 'object') {
                return $firebaseObject(entity);
            } else if (type === 'array') {
                return $firebaseArray(entity);
            } else if (type === 'auth') {
                return $firebaseAuth(entity);
            } else if (type === 'geo') {
                return new GeoFire(entity);
            }
        }
    }

    angular.module('utils.afApi')
        .service('afEntity', afEntityService);
})(angular);
