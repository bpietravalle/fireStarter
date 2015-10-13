(function() {
    "use strict";
    var GeoMngr;


    angular.module("fb.services")
        .factory("geoMngr", geoMngrFactory);

    /** @ngInject */
    function geoMngrFactory($rootScope, $timeout, $q, fbRef, $log) {

        return function(path) {
            var gf = new GeoMngr($rootScope, $timeout, $q, fbRef, $log, path);
            return gf.construct();
        };

    }

    GeoMngr = function($rootScope, $timeout, $q, fbRef, $log, path) {
        this._rootScope = $rootScope;
        this._timeout = $timeout;
        this._q = $q;
        this._fbRef = fbRef;
        this._log = $log;
        if (!path) {
            throw new Error("You must define a path to build a GeoFire object: " + path);

        }
        this._path = path;
        this._geofireRef = this._fbRef.ref(this._path);
        this._geoFire = new GeoFire(this._geofireRef);
        this._onPointsNearLocCallbacks = [];
        this._onPointsNearId = [];
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
            geo.pointsNearCb = pointsNearCb;
            geo.pointsNearId = pointsNearId;


            function pointsNearCb() {
                return self._onPointsNearLocCallbacks;
            }

            function pointsNearId() {
                return self._onPointsNearId;
            }

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
                    on: function(eventType, broadcastName) {
                        return geoQuery.on(eventType, function(key, location, distance) {
                            return self._rootScope.$broadcast(broadcastName, key, location, distance);
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



            self._geo = geo;
            return self._geo

        }

    };

}.call(this));
