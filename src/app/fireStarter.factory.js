(function() {
    "use strict";

    angular.module("firebase.starter", ["firebase"])
        .config(function($provide) {
            $provide.provider("fireStarter", FireStarter);
        });

    function FireStarter() {
        var self = this;
        self.setRoot = setRoot;
        self.getRoot = getRoot;

        function setRoot(val) {
            return angular.extend(self, {
                _rootPath: val
            });
        };

        function getRoot() {
            return self._rootPath;
        }

        self.$get = fireStarterGet;

        /** @ngInject */
        function fireStarterGet($timeout, $window, $firebaseAuth, $firebaseObject, $firebaseArray, $q, $log) {
            self._timeout = $timeout;
            self._window = $window;
            self._firebaseAuth = $firebaseAuth;
            self._firebaseObject = $firebaseObject;
            self._firebaseArray = $firebaseArray;
            self._GeoFire = GeoFire;
            self._q = $q;
            self._log = $log;

            return function(type, path, flag) {
                self._type = type;
                self._path = path;
                self._flag = flag;

                if (!angular.isObject(checkParams())) {
                    self._firebase = build();
                }

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
                } else if (typeOptions.indexOf(self._type) < 0) {
                    throw new Error("Invalid type: " + self._type + ".  Please enter 'auth','object','array', 'ref', or 'geo'");
                } else if (angular.isObject(self._flag) && self._flag !== true) {

                    throw new Error("Invalid flag: " + self._flag + ". Please enter 'true' if you wish to bypass creating a firebase Reference");
                } else if (Array.isArray(self._path) && angular.isObject(self._flag)) {
                    throw new Error("Invalid flag: " + self._flag + " for path: " + self._path + ".  Please leave flag argument undefined if you wish to create a firebase Reference");
                } else {
                    return null;
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
                if (args.length) {
                    ref = ref.child(setPath(args));
                }
                return ref;
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

            function wrap(t, entity) {
                switch (t) {
                    case "object":
                        return self._firebaseObject(entity);
                    case "array":
                        return self._firebaseArray(entity);
                    case "auth":
                        return self._firebaseAuth(entity);
                    case "geo":
                        return new self._GeoFire(entity);
                }
            }

            function buildGeofire() {
                /*  inspired by angularGeoFire by Mike Pugh
                 */

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
                                }, function(err) {
                                    return err;
                                })
                        })
                        .then(setReturnValue)
                        .catch(standardError);

                    function setReturnValue(res) {
                        return res;
                    }

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
                                return geoQuery.updateCriteria(criteria);
                            },
                            on: function(eventType, cb, context) {
                                return geoQuery.on(eventType, function(key, location, distance) {
                                    return qWrap(cb.call(context, key, location, distance))
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
                                .then(null, function(err) {
                                    return self._q.reject(err);
                                })
                        })
                        .then(geofireRef)
                        .catch(standardError);
                }

                function geofireSet(key, coords) {
                    return self._timeout(function() {
                            self._firebase.set(key, coords)
                                .then(null,
                                    function(err) {
                                        return self._q.reject(err);
                                    })
                        })
                        .then(geofireRef)
                        .catch(standardError);
                }


                function qWrap(obj) {
                    return self._q.when(obj);
                }

                function inspect(item) {
                    if (item) {
                        item = "_" + item;
                        return self[item];
                    } else {
                        return self;
                    }
                }

                function standardError(err) {
                    return self._q.reject(err);
                }
            }
        }
    }

}.call(this));
