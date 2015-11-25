(function() {
    "use strict";
    var FireStarter;

    angular.module("firebase.starter", ["firebase"])
        .provider("fireStarter", FireStarterProvider);


    function FireStarterProvider() {
        var prov = this;
        prov.setRoot = function(val) {
            prov.rootRef = val;

        };
        prov.$get = ["$timeout", "$injector", "$window", "$firebaseAuth", "$firebaseObject",
            "$firebaseArray", "$q", "$log",
            function($timeout, $injector, $window, $firebaseAuth, $firebaseObject, $firebaseArray, $q, $log) {

                return function(type, path, flag) {
                    var fb = new FireStarter($timeout, $injector, $window, $firebaseAuth, $firebaseObject, $firebaseArray, $q, $log, type, path, flag);
                    return fb.construct();

                };

            }
        ];

        function FireStarter($timeout, $injector, $window, $firebaseAuth, $firebaseObject, $firebaseArray, $q, $log, type, path, flag) {
            this._timeout = $timeout;
            this._injector = $injector;
            this._window = $window;
            this._firebaseAuth = $firebaseAuth;
            this._firebaseObject = $firebaseObject;
            this._firebaseArray = $firebaseArray;
            this._GeoFire = GeoFire;
            this._q = $q;
            this._log = $log;
            this._path = path;
            this._type = type;
            var typeOptions = ["auth", "array", "object", "geo", "ref"];
            if (typeOptions.indexOf(this._type) < 0) {
                throw new Error("Invalid type: " + this._type + ".  Please enter 'auth','object','array', 'ref', or 'geo'");
            }
            this._flag = flag || null;
            if (angular.isObject(this._flag) && this._flag !== true) {
                throw new Error("Invalid flag: " + this._flag + ". Please enter 'true' if you wish to bypass creating a firebase Reference");
            }
            if (Array.isArray(this._path) && angular.isObject(this._flag)) {
                throw new Error("Invalid flag: " + this._flag + " for path: " + this._path + ".  Please leave flag argument undefined if you wish to create a firebase Reference");
            }
            this._rootPath = prov.rootRef
            if (!this._rootPath) {
                throw new Error("You must specify a root firebase node in a config block");
            }
            if (!angular.isString(this._rootPath)) {
                throw new Error("Invalid type.  Root firebase node must be a string.  Error at: " + this._rootPath);
            }
            this._build = build;
            this._wrap = wrap;
            this._setRef = setRef;
            this._root = new this._window.Firebase(this._rootPath);


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
                var args = Array.prototype.slice.call(arguments);
                var ref = this._root;
                if (args.length) {
                    ref = ref.child(setPath(args));
                }
                return ref;
            }

            function build(t, p, f) {
                switch (f) {
                    case true:
                        return this._wrap(t, p);
                    default:
                        switch (t) {
                            case "ref":
                                return this._setRef(p);
                            case "auth":
                                return this._wrap(t, this._root);
                            default:
                                return this._wrap(t, this._setRef(p));
                        }
                }
            }

            function wrap(t, entity) {
                switch (t) {
                    case "object":
                        return this._firebaseObject(entity);
                    case "array":
                        return this._firebaseArray(entity);
                    case "auth":
                        return this._firebaseAuth(entity);
                    case "geo":
                        return new this._GeoFire(entity);
										default:
											throw new Error("Invalid type at: " + t);

                }
            }

            this._firebase = this._build(this._type, this._path, this._flag);
        };


        FireStarter.prototype = {
            construct: function() {
                var self = this;
                var fire = {};

                fire.timestamp = timestamp;
                fire.inspect = inspect;

                function root() {
                    return self._window.Firebase(self._rootPath);
                }

                switch (self._type) {
                    case "geo":
                        return Geofire(fire);
                    default:
                        return returnBase(fire);
                }


                function Geofire(geo) {
                    /*  inspired by angularGeoFire by Mike Pugh
                     */

                    return angular.extend(geo, {

                        distance: geofireDistance,
                        get: geofireGet,
                        query: geofireQuery,
                        $ref: geofireRef,
                        ref: geofireRef,
                        remove: geofireRemove,
                        set: geofireSet,
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

                }


                function timestamp() {
                    return Firebase.ServerValue.TIMESTAMP;
                }

                function returnBase() {
                    return self._firebase;
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

                self._fire = fire;
                return self._fire;
            }

        };

    }
}.call(this));
