// code from firebase/angularfire-seed repo

angular.module('utils.jsApi')
    .factory('fbEntity', ['$window', 'FBURL', '$q',
        function($window, FBURL, $q) {
            "use strict";

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

                ref: firebaseRef
            };

            return utils;
						//TODO: move firebaseRef and pathRef up into fb.utils module
						//shouldn't be specific to jsApi

            function pathRef(args) {
                for (var i = 0; i < args.length; i++) {
                    if (angular.isArray(args[i])) {
                        args[i] = pathRef(args[i]);
                    } else if (typeof args[i] !== 'string') {
                        throw new Error('Argument ' + i + ' to firebaseRef is not a string: ' + args[i] + "and the rest" + args);
                    }
                }
                return args.join('/');
            }

            function firebaseRef(path) {
                var ref = new $window.Firebase(FBURL);
                var args = Array.prototype.slice.call(arguments);
                if (args.length) {
                    ref = ref.child(pathRef(args));
                }
                return ref;
            }
        }
    ]);
