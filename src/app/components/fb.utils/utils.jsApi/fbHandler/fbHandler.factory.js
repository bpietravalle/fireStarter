// code from firebase/angularfire-seed repo
(function(angular) {
    "use strict";

    function fbHandlerFactory($q) {

        var utils = {
            handler: function(fn, context) {
                return utils.defer(function(def) {
                    fn.call(context, function(err, result) {
                        if (err !== null) {
                            def.reject(err);
                        } else {
                            def.resolve(result);
                        }
                    });
                });
            },
            defer: function(fn, context) {
                var def = $q.defer();
                fn.call(context, def);
                return def.promise;
            },

        };

        return utils;
    }
    fbHandlerFactory.$inject = ['$q'];
    angular.module('utils.jsApi')
        .factory('fbHandler', fbHandlerFactory);
})(angular);
