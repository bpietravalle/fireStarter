(function() {
    "use strict";
    var FireStarter;

    angular.module("fireStarter.services")
        .factory("fireStarter", FireStarterFactory);

    /** @ngInject */
    function FireStarterFactory(baseBuilder, fbHelper, $q, $log) {

        return function(type, path, flag) {
            var fb = new FireStarter(baseBuilder, $q, $log, type, path, flag);
            return fb.construct();

        };

    }

    /* constructor for path fireects
     * @param {Array of strings}
     * @return Promise($firebase)
     */

    FireStarter = function(baseBuilder, $q, $log, type, path, flag) {
        this._baseBuilder = baseBuilder;
        this._type = type;
        this._flag = flag;
        this._q = $q;
        this._log = $log;
        this._path = path;
        this._firebase = this._baseBuilder.build(this._type, this._path, this._flag);
    };


    FireStarter.prototype = {
        construct: function() {
            var self = this;
            var fire = {};

            fire.base = base;
            fire.path = path;
            fire.timestamp = timestamp;

            function base() {
                return self._firebase;
            }

            function path() {
                return self._path;
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
                    authWithPassword: authWithPassword,
                    authWithOAuthPopup: authWithOAuthPopup,
                    changePassword: changePassword,
                    changeEmail: changeEmail,
                    createUser: createUser,
                    getAuth: getAuth,
                    removeUser: removeUser,
                    requireAuth: requireAuth,
                    resetPassword: resetPassword,
                    unauth: unauth
                });

                function authWithPassword(creds) {
                    return self._firebase.$authWithPassword({
                        email: creds.email,
                        password: creds.password
                    })
                }



                function authWithOAuthPopup(provider) {
                    var options = {
                        remember: true,
                        scope: "email"
                    };

                    return self._firebase.$authWithOAuthPopup(provider, options);
                }

                function changeEmail(creds) {

                    return self._firebase.$changeEmail({
                        oldEmail: creds.oldEmail,
                        newEmail: creds.newEmail,
                        password: creds.password
                    });
                }

                function changePassword(creds) {
                    return self._firebase.$changePassword({
                        oldPassword: creds.oldPassword,
                        newPassword: creds.newPassword
                    });
                }

                function createUser(creds) {
                    return self._firebase.$createUser({
                        password: creds.password
                    });
                }


                function getAuth() {
                    return self._firebase.$getAuth();
                }

                function removeUser(creds) {
                    return self._firebase.$removeUser({
                        password: creds.password
                    });
                }

                function requireAuth() {
                    return self._firebase.$requireAuth();
                }

                function resetPassword(creds) {
                    return self._firebase.$resetPassword({});
                }


                function unauth() {
                    return self._firebase.$unauth();
                }

            }

            function Geofire(geo) {

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
                    return self._q.when(self._firebase)
                        .then(completeAction)
                        .catch(standardError);

                    function completeAction(res) {
                        return res.get(key);
                    }

                }

                function geofireQuery(data) {
                    var geoQuery;

                    return buildQuery(data)
                        .then(extendQuery)
                        .catch(standardError);

                    function buildQuery(res) {
                        return self._q.when(self._firebase.query({
                            center: res.center,
                            radius: res.radius
                        }));
                    }

                    function extendQuery(res) {
                        geoQuery = {
                            center: function() {
                                return res.center();
                            },
                            radius: function() {
                                return res.radius();
                            },
                            updateCriteria: function(criteria) {
                                return res.updateCriteria(criteria);
                            },
                            on: function(eventType, cb, context) {
                                return res.on(eventType, function(key, location, distance) {
                                    return self._q.when(cb.call(context, key, location, distance))
                                        .catch(standardError);
                                });
                            },
                            cancel: function() {
                                return res.cancel();
                            }
                        };
                        return geoQuery;

                    }

                }

                function geofireRef() {
                    return self._firebase.ref();
                }


                function geofireRemove(key) {
                    return self._q.when(self._firebase)
                        .then(completeAction)
                        .catch(standardError);

                    function completeAction(res) {
                        return self._firebase.remove(key);
                    }

                }

                function geofireSet(key, coords) {
                    return self._q.when(self._firebase)
                        .then(completeAction)
                        .catch(standardError);

                    function completeAction(res) {
                        return self._firebase.set(key, coords);
                    }

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
                    save: save
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

                function loaded() {
                    return self._firebase.$loaded();
                }

                function ref() {
                    return self._firebase.$ref();
                }


                function remove(rec) {
                    return self._firebase.$remove();

                }

                function save(rec) {
                    return self._firebase.$save(rec);
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
                    // self._fire = fire;
                    // return self._fire;
            }

            function standardError(err) {
                return self._q.reject(err);
            }

            self._fire = fire;
            return self;
        }

    };



}.call(this));
