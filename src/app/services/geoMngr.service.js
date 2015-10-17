(function() {
    "use strict";
    var GeoMngr;


    angular.module("fireStarter.services")
        .factory("geoMngr", geoMngrFactory);

    /** @ngInject */
    function geoMngrFactory($timeout, $q, geoRef, $log) {

        return function(path) {
            var gf = new GeoMngr( $timeout, $q, geoRef, $log, path);
            return gf.construct();
        };

    }

    GeoMngr = function($timeout, $q, geoRef, $log, path) {
        this._timeout = $timeout;
        this._q = $q;
        this._geoRef = geoRef;
        this._log = $log;
        this._path = path;
        this._geoFire = this._geoRef(this._path);
    };

    GeoMngr.prototype = {
        construct: function() {
            var self = this;
            var geo = {};

            geo.distance = geofireDistance;
            geo.get = geofireGet;
            geo.path = self._path;
            geo.query = geofireQuery;
            geo.ref = geofireRef;
            geo.remove = geofireRemove;
            geo.set = geofireSet;


            function geofireDistance(loc1, loc2) {
                return self._geoFire.distance(loc1, loc2);
            }


            function geofireGet(key) {
                var deferred = self._q.defer();
                self._timeout(function() {
                    self._geoFire.get(key).then(function(location) {
                        deferred.resolve(location);
                    }).catch(function(error) {
                        deferred.reject(error);
                    });
                });
                return deferred.promise;
            }

            function geofireQuery(data) {

                var geoQuery = self._geoFire.query({
                    center: data.center,
                    radius: data.radius
                });
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
                    on: function(eventType, cb, scope) {
                        return geoQuery.on(eventType, function(key, location, distance) {
                            return self._q.when(cb.call(scope, key, location, distance))
                                .catch(standardError);
                        });
                    },
                    cancel: function() {
                        return geoQuery.cancel();
                    }
                };

            }

            function geofireRef() {
                return self._geoFire.ref();
            }


            function geofireRemove(key) {
                var deferred = self._q.defer();
                self._timeout(function() {
                    self._geoFire.remove(key).then(function() {
                        deferred.resolve(null);
                    }).catch(function(error) {
                        deferred.reject(error);
                    });
                });
                return deferred.promise;

            }

            function geofireSet(key, coords) {
                var deferred = self._q.defer();
                self._timeout(function() {
                    self._geoFire.set(key, coords).then(function() {
                        deferred.resolve(null);
                    }).catch(function(error) {
                        deferred.reject(error);
                    });
                });
                return deferred.promise;

            }

            function standardError(err) {
                return self._q.reject(err);
            }

            self._geo = geo;
            return self._geo

        }

    };

}.call(this));
