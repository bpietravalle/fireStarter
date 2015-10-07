(function() {
    "use strict";
    var GeoMngr;


    angular.module("fb.services")
        .factory("geoMngr", geoMngrFactory);

    /** @ngInject */
    function geoMngrFactory($q, $geofire, fbRef, $log) {

        return function(path) {
            var gf = new GeoMngr($q, $geofire, fbRef, $log, path);
            return gf.construct();
        };

    }

    GeoMngr = function($q, $geofire, fbRef, $log, path) {
        this._q = $q;
        this._geofire = $geofire;
        this._fbRef = fbRef;
        this._log = $log;
        if (!path) {
            throw new Error("You must define a path to build a GeoFire object: " + path);

        }
        this._path = path;
        this._geofireRef = this._fbRef.ref(this._path);
        this._angularGeoFire = this._q.when(this._geofire(this._geofireRef));
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


            // function angularGeoFireInstance() {
            //     if (self._angularGeoFire) {
            //         return self._angularGeoFire;
            //     } else {
            //         throw new Error("You haven't created the $geofire object yet");
            //     }
            // }

            function geofireDistance(loc1, loc2) {
                return self._angularGeoFire
                    .then(calculateDistance)
                    .catch(standardError);

                function calculateDistance(res) {
                    return res.$distance(loc1, loc2);
                }
            }


            function geofireGet(key) {
                return self._angularGeoFire
                    .then(callGet)
                    .catch(standardError);

                function callGet(res) {
                    return res.$get(key);
                }
            }

            function geofireQuery(data) {

                return self._angularGeoFire
                    .then(completeQuery)
                    .catch(standardError);

                function completeQuery(res) {
                    self._log.info(res);
                    return res.$query({
                        center: data.center,
                        radius: data.radius
                    });
                }
            }

            function geofireRef() {
                return self._geofireRef;
            }


            function geofireRemove(key) {
                return self._angularGeoFire
                    .then(callRemove)
                    .catch(standardError);

                function callRemove(res) {
                    return res.$remove(key);
                }
            }

            function geofireSet(key, coords) {
                return self._angularGeoFire
                    .then(callSet)
                    .catch(standardError);

                function callSet(res) {
                    return res.$set(key, coords);
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
