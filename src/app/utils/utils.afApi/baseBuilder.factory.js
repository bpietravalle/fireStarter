(function(angular) {
    "use strict";

    /** @ngInject */
    function baseBuilderFactory($timeout, $q, $log, $firebaseObject, $firebaseArray, $firebaseAuth, fbRef) {
        var utils = {
            set: set,
            wrap: wrap,
            build: build
        };
        return utils;



        function build(type, path, flag) {
            return set(type, path, flag);
            // var deferred = $q.defer();
            // $timeout(function() {
            //     $q.when(set(type, path, flag)).then(function(result) {
            //         deferred.resolve(result);
            //     }).catch(function(error) {
            //         deferred.reject(error);
            //     });
            // });
            // return deferred.promise;
        }

        //TODO: checkparams as $q.all
        //for some reason wasn't working for firebaseAuth tests
        function set(type, path, flag) {
            checkParams(type, path, flag)
            return completeBuild([type, path, flag]);
        }

        function completeBuild(res) {
            if (res[0] === 'auth' && !res[1]) {
                return wrap(res[0], fbRef.root());
            } else if (res[2] === true) {
                return wrap(res[0], res[1]);
            } else {
                return wrap(res[0], setRef(res[1]));
            }
        }

        function checkParams(t, p, f) {
            checkType(t)
            checkPath(p, f);
            checkFlag(f);
        }

        function checkType(t) {
            if (t !== "auth" && t !== "array" && t !== "object" && t !== "geo") {
                throw new Error("Invalid type.  Please enter auth,object,array, or geo");
            }
        }

        function checkFlag(f) {
            if (angular.isObject(f) && f !== true) {
                throw new Error("Invalid flag. Please enter 'true' if you wish to bypass creating a firebase Reference");
            }

        }

        function checkPath(p, f) {

            if (Array.isArray(p) && isPath(p) && angular.isObject(f)) {
                throw new Error("Invalid flag.  Please leave flag argument null if you wish to create a firebase Reference");
            }

            function isPath(p) {
                //check that each item is a string
                //or lookup in pathmngr to see if can exist
                return true;

            }

        }


        function setRef(path) {
            return fbRef.ref(path);
        }

        function wrap(type, entity) {
            if (type === 'object') {
                $log.info(entity);
                return $firebaseObject(entity);
            } else if (type === 'array') {
                $log.info(entity);
                return $firebaseArray(entity);
            } else if (type === 'auth') {
                $log.info(entity);
                return $firebaseAuth(entity);
            } else if (type === 'geo') {
                return new GeoFire(entity);
            }
        }

        function standardError(err) {
            return $q.reject(err);
        }
    }

    angular.module('utils.afApi')
        .factory('baseBuilder', baseBuilderFactory);
})(angular);
