(function() {
    "use strict";
    var FireStarter;

    angular.module("fireStarter.services")
        .factory("fireStarter", FireStarterFactory);

    /** @ngInject */
    function FireStarterFactory($timeout, baseBuilder, $q, $log) {

        return function(type, path, flag) {
            var fb = new FireStarter($timeout, baseBuilder, $q, $log, type, path, flag);
            return fb.construct();

        };

    }

    /* constructor for path fireects
     * @param {Array of strings}
     * @return Promise($firebase)
     */

    FireStarter = function($timeout, baseBuilder, $q, $log, type, path, flag) {
        this._timeout = $timeout;
        this._baseBuilder = baseBuilder;
        this._type = type;
        this._flag = flag;
        this._q = $q;
        this._log = $log;
        this._path = path;
        this._firebase = this._baseBuilder.init(this._type, this._path, this._flag);
    };


    FireStarter.prototype = {
        construct: function() {
            var self = this;
            var fire = {};

            fire.base = base;
            fire.path = path;
            fire.timestamp = timestamp;

            function base() {
                //I'm lazy and until I find a better way to return the firebase when needed
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

            switch (self._type) {
                case "object":
                    return FirebaseObject(fire);
                    break;
                case "array":
                    return FirebaseArray(fire);
                    break;
                case "auth":
                    return FirebaseAuth(fire);
                    break;
                case "geo":
                    return Geofire(fire);
                    break;
            }

            function FirebaseAuth(auth) {

                return angular.extend(auth, {
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
                /* from angularGeoFire - trying q.when instead of 
                 * deferred obj/$timeout
                 */

                return angular.extend(geo, {

                    distance: geofireDistance,
                    get: geofireGet,
                    query: geofireQuery,
                    ref: geofireRef,
                    remove: geofireRemove,
                    set: geofireSet,
                });

                function geofireDistance(loc1, loc2) {
                    return self._firebase.distance(loc1, loc2);
                }

                function geofireGet(key) {
                    return qWrap(self._firebase.get(key))
                        .catch(standardError);

                    // var deferred = self._q.defer();
                    // self._timeout(function() {
                    //     self._firebase.get(key).then(function(location) {
                    //         deferred.resolve(location);
                    //     }).catch(function(error) {
                    //         deferred.reject(error);
                    //     });
                    // });
                    // return deferred.promise;
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
                    // var deferred = self._q.defer();
                    return qWrap(self._firebase.remove(key))
                        .then(returnGeoRef)
                        .catch(standardError);
                    // self._timeout(function() {
                    //     self._firebase.remove(key).then(function() {
                    //         deferred.resolve(null);
                    //     }).catch(function(error) {
                    //         deferred.reject(error);
                    //     });
                    // });
                    // return deferred.promise;
                }


                function geofireSet(key, coords) {
                    // var deferred = self._q.defer();
                    // return self._timeout(function() {
                    return qWrap(self._firebase.set(key, coords))
                        .then(returnGeoRef)
                        .catch(standardError);

                    // function() {
                    // deferred.resolve(function() {
                    // return geofireRef();
                    // });
                    // }).catch(function(error) {
                    // deferred.reject(error);
                    // });
                    // });
                    // return deferred.promise;
                }


                function returnGeoRef(res) {
                    return qWrap(geofireRef());
                }
            }

            function FirebaseArray(arr) {

                return angular.extend(arr, {
                    add: add,
                    destroy: destroy,
                    getRecord: getRecord,
                    keyAt: keyAt,
                    indexFor: indexFor,
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


                function keyAt(rec) {
                    return self._firebase.$keyAt(rec);
                }

                function loaded(s, f) {
                    return self._firebase.$loaded(s, f);
                }

                function ref() {
                    return self._firebase.$ref();
                }


								//TODO add test for case when pass key instead of idx/record;
                function remove(rec, flag) {
                    if (angular.isString(rec) && flag ===true) {
                        rec = indexFor(rec);
                    }
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
                    return self._firebase.$bindTo(s, v)
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
                    return self._firebase.$save()
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

            function qWrap(obj) {
                return self._q.when(obj);
            }

            function standardError(err) {
                return self._q.reject(err);
            }

            self._fire = fire;
            return self._fire;
        }

    };



}.call(this));
