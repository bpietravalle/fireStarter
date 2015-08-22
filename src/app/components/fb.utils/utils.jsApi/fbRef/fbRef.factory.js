// code (almostly entirely) from firebase/angularfire-seed repo
(function(angular) {
    "use strict";

    function fbRefFactory($window, FBURL) {
        var utils = {
            path: pathRef,
            root: setRoot,
            ref: firebaseRef
        };

        return utils;

        function pathRef(args) {
            for (var i = 0; i < args.length; i++) {
                if (angular.isArray(args[i])) {
                    args[i] = pathRef(args[i]);
                } else if (typeof args[i] !== 'string') {
                    throw new Error('Argument ' + i + ' to firebaseRef is not a string: ' + args[i]);
                }
            }
            return args.join('/');
        }

        function setRoot() {
            return new $window.Firebase(FBURL);
        };

        function firebaseRef(path) {
            var ref = setRoot();
            var args = Array.prototype.slice.call(arguments);
            if (args.length) {
                ref = ref.child(pathRef(args));
            }
            return ref;
        }
    }
    fbRefFactory.$inject = ['$window', 'FBURL'];

    angular.module('utils.jsApi')
        .factory('fbRef', fbRefFactory);
})(angular);
// if args, then pathRef
// else setParent
// once pathRef, makeObject
// makeObject = setParent + pathRef
// afEntity.set(type, makeObject)
