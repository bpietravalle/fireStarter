(function() {
    "use strict";
    var FireStarter;

    angular.module("fireStarter.services")
        .factory("fireStarter", FireStarterFactory);

    /** @ngInject */
    function FireStarterFactory($timeout, baseBuilder, fbHelper, $q, $log) {

        return function(type, path, flag) {
            var fb = new FireStarter($timeout, baseBuilder, $q, $log, type, path, flag);
            return fb.construct(type);

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
        this._firebase = this._baseBuilder.build(this._type, this._path, this._flag)
        // this._base = this._baseBuilder.build(this._type, this._path, this._flag)
        // this._firebase = this._base.then(function(result) {
        //     return result;
        // }).catch(function(error) {
        //     return self._q.reject(error);
        // });
    };


    FireStarter.prototype = {
        construct: function() {
            var self = this;
            var fire = {}

            fire.path = path;
            fire.timestamp = timestamp;
            fire.test = test;

            function test() {
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
                    return FirebaseObject();
                    break;
                case "array":
                    return FirebaseArray();
                    break;
                case "auth":
                    return FirebaseAuth();
                    break;
                case "geo":
                    return Geofire();
                    break;
            }

            function FirebaseAuth() {

                fire.authWithPassword = authWithPassword;
                fire.authWithOAuthPopup = authWithOAuthPopup;
                fire.changePassword = changePassword;
                fire.changeEmail = changeEmail;
                fire.createUser = createUser;
                fire.getAuth = getAuth;
                fire.removeUser = removeUser;
                fire.requireAuth = requireAuth;
                fire.resetPassword = resetPassword;
                fire.unauth = unauth;

                function authWithPassword(creds) {
                    // return self._firebase
                    //     .then(completeAction)

                    // function completeAction(res) {
                    var deferred = self._q.defer();
                    self._timeout(function() {
                        self._firebase.$authWithPassword({
                                email: creds.email,
                                password: creds.password
                            })
                            .then(function(res) {
                                deferred.resolve(res);
                            }).catch(function(err) {
                                deferred.reject(err);
                            });
                    });
                    self._log.info(deferred.promise);
                    return deferred.promise;
                }



                function authWithOAuthPopup(provider) {
                    var options = {
                        remember: true,
                        scope: "email"
                    };
                    return self._firebase
                        .then(completeAction)
                        .catch(standardError);

                    function completeAction(res) {
                        return res.$authWithOAuthPopup(provider, options);
                    }
                }

                function changeEmail(creds) {
                    return self._firebase
                        .then(completeAction)
                        .catch(standardError);

                    function completeAction(res) {
                        return res.$changeEmail({
                            oldEmail: creds.oldEmail,
                            newEmail: creds.newEmail,
                            password: creds.password
                        });
                    }
                }

                function changePassword(creds) {
                    return self._firebase
                        .then(completeAction)
                        .catch(standardError);

                    function completeAction(res) {
                        return res.$changePassword({
                            email: creds.email,
                            oldPassword: creds.oldPassword,
                            newPassword: creds.newPassword
                        });
                    }
                }

                function createUser(creds) {
                    return self._firebase
                        .then(completeAction)
                        .catch(standardError);

                    function completeAction(res) {
                        return res.$createUser({
                            email: creds.email,
                            password: creds.password
                        });
                    }
                }


                function getAuth() {
                    return self._firebase
                        .then(completeAction)
                        .catch(standardError);

                    function completeAction(res) {
                        return res.$getAuth();
                    }
                }

                function removeUser(creds) {
                    return self._firebase
                        .then(completeAction)
                        .catch(standardError);

                    function completeAction(res) {
                        return res.$removeUser({
                            email: creds.email,
                            password: creds.password
                        });
                    }
                }

                function requireAuth() {
                    return self._firebase
                        .then(completeAction)
                        .catch(standardError);

                    function completeAction(res) {
                        return res.$requireAuth();
                    }
                }

                function resetPassword(creds) {
                    return self._firebase
                        .then(completeAction)
                        .catch(standardError);

                    function completeAction(res) {
                        return res.$resetPassword({
                            email: creds.email,
                        });
                    }
                }


                function unauth() {
                    return self._firebase
                        .then(completeAction)
                        .catch(standardError);

                    function completeAction(res) {
                        return res.$unauth();
                    }
                }

                self._fire = fire;
                return self._fire;
            }

            function Geofire() {

                fire.distance = geofireDistance;
                fire.get = geofireGet;
                fire.query = geofireQuery;
                fire.ref = geofireRef;
                fire.remove = geofireRemove;
                fire.set = geofireSet;

                function geofireDistance(loc1, loc2) {
                    return self._firebase
                        .then(completeAction)
                        .catch(standardError);

                    function completeAction(res) {
                        return res.distance(loc1, loc2);
                    }
                }


                function geofireGet(key) {
                    return self._firebase
                        .then(completeAction)
                        .catch(standardError);

                    function completeAction(res) {
                        return res.get(key);
                    }

                }

                function geofireQuery(data) {
                    var geoQuery;

                    return self._firebase
                        .then(buildQuery)
                        .then(extendQuery)
                        .catch(standardError);

                    function buildQuery(res) {
                        return self._q.when(res.query({
                            center: data.center,
                            radius: data.radius
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
                    return self._firebase
                        .then(completeAction)
                        .catch(standardError);

                    function completeAction(res) {
                        return res.ref();
                    }
                }


                function geofireRemove(key) {
                    return self._firebase
                        .then(completeAction)
                        .catch(standardError);

                    function completeAction(res) {
                        return res.remove(key);
                    }

                }

                function geofireSet(key, coords) {
                    return self._firebase
                        .then(completeAction)
                        .catch(standardError);

                    function completeAction(res) {
                        return res.set(key, coords);
                    }

                }
                self._fire = fire;
                return self._fire;

            }

            function FirebaseArray() {

                fire.add = add;
                fire.destroy = destroy;
                fire.getRecord = getRecord;
                fire.keyAt = keyAt;
                fire.indexFor = indexFor;
                fire.loaded = loaded;
                fire.ref = ref;
                fire.remove = remove;
                fire.save = save;

                function add(rec) {
                    return self._firebase
                        .then(completeAction)
                        .catch(standardError);

                    function completeAction(res) {
                        return res.$add(rec);
                    }
                }

                function destroy() {
                    return self._firebase
                        .then(completeAction)
                        .catch(standardError);

                    function completeAction(res) {
                        return res.$destroy();
                    }
                }

                function getRecord(key) {
                    return self._firebase
                        .then(completeAction)
                        .catch(standardError);

                    function completeAction(res) {
                        return res.$getRecord(key);
                    }
                }

                function indexFor(val) {
                    return self._firebase
                        .then(completeAction)
                        .catch(standardError);

                    function completeAction(res) {
                        return res.$indexFor(val);
                    }
                }


                function keyAt(rec) {
                    return self._firebase
                        .then(completeAction)
                        .catch(standardError);

                    function completeAction(res) {
                        return res.$keyAt(rec);
                    }
                }

                function loaded() {
                    return self._firebase
                        .then(completeAction)
                        .catch(standardError);

                    function completeAction(res) {
                        return res.$loaded();
                    }
                }

                function ref() {
                    return self._firebase
                        .then(completeAction)
                        .catch(standardError);

                    function completeAction(res) {
                        return res.$ref();
                    }
                }


                function remove(rec) {
                    return self._firebase
                        .then(completeAction)
                        .catch(standardError);

                    function completeAction(res) {
                        return res.$remove();
                    }

                }

                function save(rec) {
                    return self._firebase
                        .then(completeAction)
                        .catch(standardError);

                    function completeAction(res) {
                        return res.$save(rec);
                    }
                }

                self._fire = fire;
                return self._fire;
            }

            function FirebaseObject() {

                fire.bindTo = bindTo;
                fire.destroy = destroy;
                fire.id = id;
                fire.loaded = loaded;
                fire.ref = ref;
                fire.remove = remove;
                fire.save = save;
                fire.priority = priority;
                fire.value = value;

                function bindTo(s, v) {
                    return self._firebase
                        .then(completeAction)
                        .catch(standardError);

                    function completeAction(res) {
                        return res.$bindTo(s, v)
                    }
                }

                function destroy() {
                    return self._firebase
                        .then(completeAction)
                        .catch(standardError);

                    function completeAction(res) {
                        return res.$destroy();
                    }

                }

                function id() {
                    return self._firebase
                        .then(completeAction)
                        .catch(standardError);

                    function completeAction(res) {
                        return res.$id;
                    }
                }

                function loaded() {
                    return self._firebase
                        .then(completeAction)
                        .catch(standardError);

                    function completeAction(res) {
                        return res.$loaded()
                    }
                }


                function priority() {
                    return self._firebase
                        .then(completeAction)
                        .catch(standardError);

                    function completeAction(res) {
                        return res.$priority;
                    }

                }

                function ref() {
                    return self._firebase
                        .then(completeAction)
                        .catch(standardError);

                    function completeAction(res) {
                        return res.$ref();
                    }
                }

                function remove() {
                    return self._firebase
                        .then(completeAction)
                        .catch(standardError);

                    function completeAction(res) {
                        return res.$remove()
                    }
                }


                function save() {
                    return self._firebase
                        .then(completeAction)
                        .catch(standardError);

                    function completeAction(res) {
                        return res.$save()
                    }
                }

                function value() {
                    return self._firebase
                        .then(completeAction)
                        .catch(standardError);

                    function completeAction(res) {
                        return res.$value
                    }

                }
                self._fire = fire;
                return self._fire;
            }

            function standardError(err) {
                return self._q.reject(err);
            }

            self._fire = fire;
            return self._fire;
        }

    };



}.call(this));
