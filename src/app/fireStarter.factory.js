(function() {
    "use strict";
    var FireStarter;

    angular.module("firebase-starter", ["firebase"])
        .factory("fireStarter", FireStarterFactory);

    /** @ngInject */
    function FireStarterFactory($timeout, $injector, $window, $firebaseAuth, $firebaseObject, $firebaseArray, $q, $log) {

        return function(type, path, flag, constant) {
            var fb = new FireStarter($timeout, $injector, $window, $firebaseAuth, $firebaseObject, $firebaseArray, $q, $log, type, path, flag, constant);
            return fb.construct();

        };

    }

    FireStarter = function($timeout, $injector, $window, $firebaseAuth, $firebaseObject, $firebaseArray, $q, $log, type, path, flag, constant) {
        this._timeout = $timeout;
        this._injector = $injector;
        this._window = $window;
        this._firebaseAuth = $firebaseAuth;
        this._firebaseObject = $firebaseObject;
        this._firebaseArray = $firebaseArray;
        this._q = $q;
        this._log = $log;
        this._path = path;
        this._type = type;
        var typeOptions = ["auth", "array", "object", "geo", "ARRAY", "OBJECT", "AUTH"];
        if (typeOptions.indexOf(this._type) < 0) {
            throw new Error("Invalid type: " + this._type + ".  Please enter 'auth','object','array', 'AUTH','OBJECT','ARRAY',or 'geo'");
        }
        this._flag = flag || null;
        if (angular.isObject(this._flag) && this._flag !== true) {
            throw new Error("Invalid flag: " + this._flag + ". Please enter 'true' if you wish to bypass creating a firebase Reference");
        }
        if (Array.isArray(this._path) && angular.isObject(this._flag)) {
            throw new Error("Invalid flag: " + this._flag + " for path: " + this._path + ".  Please leave flag argument undefined if you wish to create a firebase Reference");
        }
        this._constant = constant || "FBURL";
        this._rootPath = rootPath;
        this._root = getRoot;
        this._build = build;
        this._wrap = wrap;
        this._setRef = setRef;

        function rootPath() {
            return this._injector.get(this._constant);
        }

        function getRoot() {
            return new this._window.Firebase(this._rootPath());
        }

        function build(t, p, f) {
            if (t === 'auth' && !p || t === "AUTH" && !p) {
                return this._wrap(t, this._root());
            } else if (f === true) {
                return this._wrap(t, p);
            } else {
                return this._wrap(t, this._setRef(p));
            }
        }

        function setRef() {
            // from angularfire-seed repo
            var args = Array.prototype.slice.call(arguments);
            var ref = this._root();
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
            if (t === 'object' || t === 'OBJECT') {
                return this._firebaseObject(entity);
            } else if (t === 'array' || t === 'ARRAY') {
                return this._firebaseArray(entity);
            } else if (t === 'auth' || t === 'AUTH') {
                return this._firebaseAuth(entity);
            } else if (t === 'geo') {
                return new GeoFire(entity);
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

            switch (self._type) {
                case "object":
                    return FirebaseObject(fire);
                case "array":
                    return FirebaseArray(fire);
                case "auth":
                    return FirebaseAuth(fire);
                case "geo":
                    return Geofire(fire);
                case "ARRAY":
                    return returnBase(fire);
                case "OBJECT":
                    return returnBase(fire);
                case "AUTH":
                    return returnBase(fire);
            }


            function FirebaseAuth(auth) {

                return angular.extend(auth, {
                    base: base,
                    path: path,
                    authAnonymously: authAnonymously,
                    authWithCustomToken: authWithCustomToken,
                    authWithPassword: authWithPassword,
                    authWithOAuthPopup: authWithOAuthPopup,
                    changePassword: changePassword,
                    changeEmail: changeEmail,
                    createUser: createUser,
                    getAuth: getAuth,
                    onAuth: onAuth,
                    removeUser: removeUser,
                    requireAuth: requireAuth,
                    resetPassword: resetPassword,
                    unauth: unauth,
                    waitForAuth: waitForAuth
                });


                function authAnonymously(options) {
                    return self._firebase.$authAnonymously(options);
                }

                function authWithCustomToken(token, options) {
                    return self._firebase.$authWithCustomToken(token, options);
                }

                function authWithPassword(creds, options) {
                    return self._firebase.$authWithPassword(creds, options);

                }


                function authWithOAuthPopup(provider) {
                    var options = {
                        remember: true,
                        scope: "email"
                    };

                    return self._firebase.$authWithOAuthPopup(provider, options);
                }

                function changeEmail(creds) {

                    return self._firebase.$changeEmail(creds);
                }

                function changePassword(creds) {
                    return self._firebase.$changePassword(creds);
                }

                function createUser(creds) {
                    return self._firebase.$createUser(creds);
                }


                function getAuth() {
                    return self._firebase.$getAuth();
                }

                function onAuth(cb, context) {
                    return self._firebase.$onAuth(cb, context);
                }

                function removeUser(creds) {
                    return self._firebase.$removeUser(creds);
                }

                function requireAuth() {
                    return self._firebase.$requireAuth();
                }

                function resetPassword(creds) {
                    return self._firebase.$resetPassword(creds);
                }


                function unauth() {
                    return self._firebase.$unauth();
                }

                function waitForAuth() {
                    return self._firebase.$waitForAuth();
                }


            }

            function Geofire(geo) {
                /*  from angularGeoFire by Mike Pugh
                 */

                return angular.extend(geo, {

                    path: path,
                    distance: geofireDistance,
                    get: geofireGet,
                    query: geofireQuery,
                    $ref: geofireRef,
                    ref: geofireRef,
                    remove: geofireRemove,
                    set: geofireSet,
                });

                function geofireDistance(loc1, loc2) {
                    return self._firebase.distance(loc1, loc2);
                }

                function geofireGet(key) {
                    var deferred = self._q.defer();
                    self._timeout(function() {
                        self._firebase.get(key).then(function(result) {
                            deferred.resolve(result);
                        }).catch(function(error) {
                            deferred.reject(error);
                        });
                    });
                    return deferred.promise;
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
                            },
                            remove: function() {
                                return geoQuery.remove();
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

            function FirebaseArray(arr) {

                return angular.extend(arr, {
                    base: base,
                    path: path,
                    add: add,
                    destroy: destroy,
                    getRecord: getRecord,
                    keyAt: keyAt,
                    indexFor: indexFor,
                    idx: idx,
                    length: length,
                    loaded: loaded,
                    ref: ref,
                    remove: remove,
                    save: save,
                    watch: watch
                });


                function add(rec) {
                    return self._firebase.$add(rec);
                }

                function destroy() {
                    return self._firebase.$destroy();
                }

                function getRecord(key) {
                    return self._firebase.$getRecord(key);
                }

                function indexFor(val) {
                    return self._firebase.$indexFor(val);
                }

                function idx(x) {
                    return self._firebase[x];
                }

                function length() {
                    return self._firebase.length;
                }

                function keyAt(rec) {
                    return self._firebase.$keyAt(rec);
                }

                function loaded(s, f) {
                    return self._firebase.$loaded(s, f);
                }

                function ref() {
                    self._log.info(self._firebase);
                    return self._firebase.$ref();
                }

                function remove(rec) {
                    // if (angular.isNumber(rec)) {
                    //     rec = keyAt(rec);
                    // }
                    return self._firebase.$remove(rec);
                }

                function save(rec) {
                    return self._firebase.$save(rec);
                }

                function watch(cb, context) {
                    return self._firebase.$watch(cb, context);
                }

            }

            function FirebaseObject(obj) {

                return angular.extend(obj, {
                    base: base,
                    path: path,
                    bindTo: bindTo,
                    destroy: destroy,
                    id: id,
                    loaded: loaded,
                    ref: ref,
                    remove: remove,
                    save: save,
                    priority: priority,
                    value: value,
                    watch: watch
                });

                function bindTo(s, v) {
                    return self._firebase.$bindTo(s, v);
                }

                function destroy() {
                    return self._firebase.$destroy();

                }

                function id() {
                    return self._firebase.$id;
                }

                function loaded(s, f) {
                    return self._firebase.$loaded(s, f);
                }

                function priority() {
                    return self._firebase.$priority;

                }

                function ref() {
                    return self._firebase.$ref();
                }

                function remove() {
                    return self._firebase.$remove();
                }


                function save() {
                    return self._firebase.$save();
                }

                function value(val) {
                    //mmm...not so sure'bout this
                    if (!val) {
                        return self._firebase.$value;
                    } else {
                        return setValue(val);
                    }

                }

                function setValue(val) {
                    self._firebase.$value = val;
                    return self._firebase.$value;
                }

                function watch(cb, context) {
                    return self._firebase.$watch(cb, context);
                }
            }

            function base() {
                return self._firebase;
            }

            function path() {
                if (self._flag === true) {
                    return self._path.path;
                } else {
                    return self._path;
                }

            }

            function timestamp() {
                return Firebase.ServerValue.TIMESTAMP;
            }

            //untested/unused

            function returnBase() {
                return self._firebase;
            }

            function qWrap(obj) {
                return self._q.when(obj);
            }

            function inspect() {
                return self._firebase
            }

            function standardError(err) {
                return self._q.reject(err);
            }

            self._fire = fire;
            return self._fire;
        }

    };



}.call(this));
