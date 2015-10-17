(function() {
    "use strict";
    var GeoMngr;


    angular.module("fireStarter.services")
        .factory("geoMngr", geoMngrFactory);

    /** @ngInject */
    function geoMngrFactory($q, geoRef, $log) {

        return function(path) {
            var gf = new GeoMngr($q, geoRef, $log, path);
            return gf.construct();
        };

    }

    GeoMngr = function($q, geoRef, $log, path) {
        this._q = $q;
        this._geoRef = geoRef;
        this._log = $log;
        this._path = path;
        this._geoFire = this._geoRef.ref(this._path);
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
                return self._q.when(self._geoFire)
                    .then(completeAction)
                    .catch(standardError);

                function completeAction(res) {
                    return res.get(key);
                }

            }

            function geofireQuery(data) {
                var geoQuery;

                return self._q.when(self._geoFire)
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
                    // return self._q.when(geoQuery);
										return geoQuery;

                }

            }

            function geofireRef() {
                return self._geoFire.ref();
            }


            function geofireRemove(key) {
                return self._q.when(self._geoFire)
                    .then(completeAction)
                    .catch(standardError);

                function completeAction(res) {
                    return res.remove(key);
                }

            }

            function geofireSet(key, coords) {
                return self._q.when(self._geoFire)
                    .then(completeAction)
                    .catch(standardError);

                function completeAction(res) {
                    return res.set(key, coords);
                }

            }

            function standardError(err) {
                return self._q.reject(err);
            }

            self._geo = geo;
            return self._geo

        }

    };

}.call(this));
