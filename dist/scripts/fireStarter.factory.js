(function() {
    "use strict";

    angular.module("firebase.starter", ["firebase"]);
})();

(function() {
    "use strict";

    angular.module("firebase.starter")
        .config(["$provide", function($provide) {
            $provide.provider("fireStarter", FireStarter);
        }]);

    function FireStarter() {
        fireStarterGet.$inject = ["$timeout", "$window", "$firebaseAuth", "$firebaseObject", "$firebaseArray", "$q", "$log", "geofireFactory"];
        var self = this;
        self.setRoot = setRoot;
        self.getRoot = getRoot;

        /**
         * @param{String} str - the root path of your firebase
         */

        function setRoot(str) {
            return angular.extend(self, {
                _rootPath: str
            });
        }

        function getRoot() {
            return self._rootPath;
        }

        self.$get = fireStarterGet;

        /** @ngInject */
        function fireStarterGet($timeout, $window, $firebaseAuth, $firebaseObject, $firebaseArray, $q, $log, geofireFactory) {
            self._timeout = $timeout;
            self._window = $window;
            self._firebaseAuth = $firebaseAuth;
            self._firebaseObject = $firebaseObject;
            self._firebaseArray = $firebaseArray;
            self._GeoFire = geofireFactory;
            self._q = $q;
            self._log = $log;

            /**
             * @constructor
             * @param{String} type - type of object you wish to create - options are "object",
             * "ref","array","geo","auth"
             * @param{Array|Object} path - ["path","to","child","node"] relative to the root path
             * set above; if 'flag' param is 'true' this param must be the firebase reference.
             * This param should be left undefined if you wish to construct a $firebaseAuth object
             * @param{Boolean} flag - to bypass constructing a firebase ref and to simply wrap an
             * existing ref, set this param to 'true', otherwise leave undefined
             * @return{Object} firebase reference, $firebaseObject, $firebaseArray, $firebaseAuth,
             * or a GeoFire object at the given child node
             */

            return function(type, path, flag) {
                self._type = type;
                self._path = path;
                self._flag = flag;
                checkParams();
                self._firebase = build();

                switch (self._type) {
                    case "geo":
                        return buildGeofire();
                    default:
                        return self._firebase;
                }
            };

            function rootPath() {
                return self.getRoot();
            }

            function rootRef() {
                return new self._window.Firebase(rootPath());
            }

            function checkParams() {
                var typeOptions = ["auth", "array", "object", "geo", "ref"];
                if (!angular.isString(rootPath())) {
                    throw new Error("You must specify a root firebase node in a config block");
                }
                if (typeOptions.indexOf(self._type) < 0) {
                    throw new Error("Invalid type: " + self._type + ".  Please enter 'auth','object','array', 'ref', or 'geo'");
                }
                if (angular.isDefined(self._flag) && self._flag !== true) {

                    throw new Error("Invalid flag: " + self._flag + ". Please enter 'true' if you wish to bypass creating a firebase Reference");
                }
                if (angular.isArray(self._path) && angular.isDefined(self._flag) || angular.isString(self._path) && angular.isDefined(self._flag)) {
                    throw new Error("Invalid flag: " + self._flag + " for path: " + self._path + ".  Please leave flag argument undefined if you wish to create a firebase Reference");
                }
            }

            function build() {
                switch (self._flag) {
                    case true:
                        return wrap(self._type, self._path);
                    default:
                        switch (self._type) {
                            case "ref":
                                return setRef(self._path);
                            case "auth":
                                return wrap(self._type, rootRef());
                            default:
                                return wrap(self._type, setRef(self._path));
                        }
                }
            }

            function setRef() {
                // from angularfire-seed repo
                var args = Array.prototype.slice.call(arguments);
                var ref = rootRef();
                ref = ref.child(setPath(args));
                return ref;
            }

            function setPath(args) {
                // from angularfire-seed repo
                for (var i = 0; i < args.length; i++) {
                    if (angular.isArray(args[i])) {
                        args[i] = setPath(args[i]);
                    }
                    if (angular.isNumber(args[i])) {
                        args[i] = args[i].toString();
                    }
                    if (!angular.isString(args[i])) {
                        throw new Error('Argument ' + i + ' to setPath is not a string: ' + args[i]);
                    }
                }
                return args.join('/');
            }

            function wrap(t, entity) {
                switch (t) {
                    case "object":
                        return self._firebaseObject(entity);
                    case "array":
                        return self._firebaseArray(entity);
                    case "auth":
                        return self._firebaseAuth(entity);
                    case "geo":
                        return self._GeoFire.init(entity);
                }
            }

            function buildGeofire() {

                return angular.extend({}, {

                    distance: geofireDistance,
                    get: geofireGet,
                    inspect: inspect,
                    query: geofireQuery,
                    $ref: geofireRef,
                    ref: geofireRef,
                    remove: geofireRemove,
                    set: geofireSet
                });

                function geofireDistance(loc1, loc2) {
                    return self._GeoFire.distance(loc1, loc2);
                }

                function geofireGet(key) {

                    return self._timeout(function() {
                            return self._firebase.get(key)
                                .then(function(result) {
                                    return result;
                                }, standardError);
                        })
                        .catch(standardError);
                }



                function geofireQuery(data) {
                    return qWrap(self._firebase.query(data))
                        .then(extendQuery)
                        .catch(standardError);

                    function extendQuery(geoQuery) {
                        return {
                            center: function() {
                                return geoQuery.center();
                            },
                            radius: function() {
                                return geoQuery.radius();
                            },
                            updateCriteria: function(criteria) {
                                return self._timeout(function() {
                                        return geoQuery.updateCriteria(criteria);
                                    })
                                    .catch(standardError);
                            },
                            on: function(eventType, cb, ctx) {
                                return geoQuery.on(eventType, function(key, location, distance) {
                                    return qWrap(cb.call(ctx, key, location, distance))
                                        .catch(standardError);
                                });
                            },
                            cancel: function() {
                                return geoQuery.cancel();
                            }
                        };
                    }

                }


                function geofireRef() {
                    return self._firebase.ref();
                }


                function geofireRemove(key) {
                    return self._timeout(function() {
                            self._firebase.remove(key)
                                .then(null, standardError);
                        })
                        .then(returnPromRef)
                        .catch(standardError);
                }

                function returnPromRef() {
                    return self._timeout(function() {
                        return geofireRef();
                    });
                }

                function geofireSet(key, coords) {
                    return self._timeout(function() {
                            self._firebase.set(key, coords)
                                .then(null, standardError);
                        })
                        .then(returnPromRef)
                        .catch(standardError);
                }


                function qWrap(obj) {
                    return self._q.when(obj);
                }

                function inspect() {
                    return self;
                }

                function standardError(err) {
                    return self._q.reject(err);
                }
            }
        }
    }

}.call(this));

(function() {
    "use strict";
    geofireFactory.$inject = ["$window"];
    angular.module("firebase.starter")
        .service("geofireFactory", geofireFactory);

    /** @ngInject */
    function geofireFactory($window) {
        var root = $window.GeoFire;
        var geo = {
            distance: root.distance,
            init: init
        };
        return geo;

        function init(ref) {
            return new root(ref);
        }

    }

})();
