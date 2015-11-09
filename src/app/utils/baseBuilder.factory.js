(function(angular) {
    "use strict";

    /** @ngInject */
    function baseBuilderFactory($window, $log, $q, $firebaseObject, $firebaseArray, $firebaseAuth, FBURL) {
        var utils = {
            init: build
        };
        return utils;

        function build(type, path, flag) {
            return set(type, path, flag);
        }

        //TODO: checkparams as $q.all
        //for some reason wasn't working for firebaseAuth tests
        function set(type, path, flag) {
            checkParams(type, path, flag)
            return completeBuild([type, path, flag]);
        }

        function completeBuild(res) {
            if (res[0] === 'auth' && !res[1] || res[0] === "AUTH" && !res[1]) {
                return wrap(res[0], setRoot());
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
            var typeOptions = ["auth", "array", "object", "geo", "ARRAY", "OBJECT", "AUTH"];
            if (typeOptions.indexOf(t) < 0) {
                throw new Error("Invalid type: " + t + ".  Please enter 'auth','object','array', 'AUTH','OBJECT','ARRAY',or 'geo'");
            }
        }

        function checkFlag(f) {
            if (angular.isObject(f) && f !== true) {
                throw new Error("Invalid flag: " + f + ". Please enter 'true' if you wish to bypass creating a firebase Reference");
            }

        }

        function checkPath(p, f) {

            if (Array.isArray(p) && isPath(p) && angular.isObject(f)) {
                throw new Error("Invalid flag: " + f + " for path: " + p + ".  Please leave flag argument null if you wish to create a firebase Reference");
            }

            function isPath(p) {
                //TODO: check that each item is a string
                return true;

            }

        }


        function setRoot() {
            return new $window.Firebase(FBURL);
        }


        function setPath(args) {
            // from angularfire-seed repo
            for (var i = 0; i < args.length; i++) {
                if (angular.isArray(args[i])) {
                    args[i] = setPath(args[i]);
                } else if (typeof args[i] !== 'string') {
                    try {
                        args[i] = args[i].toString();
                    } catch (err) {
                        throw new Error('Argument ' + i + ' to setPath is not a string: ' + args[i]);
                    }
                }
            }
            return args.join('/');
        }

        function setRef() {
            // from angularfire-seed repo
            var ref = setRoot();
            var args = Array.prototype.slice.call(arguments);
            if (args.length) {
                ref = ref.child(setPath(args));
            }
            return ref;
        }

        function wrap(type, entity) {
            if (type === 'object' || type === 'OBJECT') {
                return $firebaseObject(entity);
            } else if (type === 'array' || type === 'ARRAY') {
                return $firebaseArray(entity);
            } else if (type === 'auth' || type === 'AUTH') {
                return $firebaseAuth(entity);
            } else if (type === 'geo') {
                return new GeoFire(entity);
            }
        }

        function standardError(err) {
            return $q.reject(err);
        }
    }

    angular.module('fireStarter.utils')
        .factory('baseBuilder', baseBuilderFactory);
})(angular);
