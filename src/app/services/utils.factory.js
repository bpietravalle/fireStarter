(function() {
    "use strict";


    /** @ngInject */
    function utilsFactory($log, $q) {

        var utils = {

            removeSlash: removeSlash,
            flatten: flatten,
            extendPath: extendPath,
            arrayify: arrayify,
            stringify: stringify,
            qWrap: qWrap,
            qAll: qAll,
            standardError: standardError,
            qAllResult: qAllResult,



        };

        return utils;

        function qWrap(obj) {
            return $q.when(obj);
        }

        function qAll(x, y) {
            return $q.all([x, qWrap(y)]);
        }

        function qAllResult(res) {
            if (res.length) {
                $log.info("flattening results");
                return flatten(res);
            } else {
                return res;
            }
        }


        function standardError(err) {
            return $q.reject(err);
        }

        function removeSlash(path) {
            if (path[-1] === "/") {
                path = path.substring(0, -1);
            }
            if (path[0] === "/") {
                path = path.substring(1);
            }
            return path;
        }

        function flatten(arr) {
            var flatResults = arr.reduce(function(x, y) {
                return x.concat(y);
            }, []);
            return flatResults;
        }

        function arrayify(param) {
            if (Array.isArray(param)) {
                return flatten(param);
            } else {
                return extendPath([], param);
            }
        }

        function stringify(arr) {
            if (Array.isArray(arr)) {
                arr = arr.join('/');
            }
            return arr;
        }

        function extendPath(arr, id) {
            arr.push(id);
            //should be able to get rid of flatten
            return flatten(arr);
        }

    }


    angular.module("fireStarter.services")
        .factory("utils", utilsFactory);

})();
