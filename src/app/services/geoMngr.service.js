(function() {
    "use strict";

    /** @ngInject */
    function geoMngrService($geofire, $q, $log, fbRef) {
        var vm = this;
        vm.build = GeoFire;


        function GeoFire(name, path) {
            if (!name || !path) {
                throw new Error("You must define a name and a path to build a GeoFire object");
            }
            var geo = this;
            geo.distance = geofireDistance;
            geo.get = geofireGet;
            geo.instance = geoInstance;
            geo.name = name;
            geo.path = path;
            geo.query = geofireQuery;
            geo.ref = geofireRef;
            geo.remove = geofireRemove;
            geo.set = geofireSet;



            function geofireDistance(loc1, loc2) {
                return geo.instance()
                    .then(calculateDistance)
                    .catch(standardError);

                function calculateDistance(res) {
                    return res.$distance(loc1, loc2);
                }
            }

						//TODO this should be the actual constructor
						//then can get rid of calling instance();
            function geoInstance() {
                return $q.when(new $geofire(geo.ref()));
            };


            function geofireGet(key) {
                return geo.instance()
                    .then(callGet)
                    .catch(standardError);

                function callGet(res) {
                    return res.$get(key);
                };
            };

            function geofireQuery(data) {

                return geo.instance()
                    .then(completeQuery)
                    .catch(standardError);

                function completeQuery(res) {
                    return res.$query({
                        center: data.center,
                        radius: data.radius
                    });
                }
            }

            function geofireRef() {
                return fbRef.ref(path);
            };

            function geofireRemove(key) {
                return geo.instance()
                    .then(callRemove)
                    .catch(standardError);

                function callRemove(res) {
                    return res.$remove(key);
                };
            };

            function geofireSet(key, coords) {
                return geo.instance()
                    .then(callSet)
                    .catch(standardError);

                function callSet(res) {
                    return res.$set(key, coords);
                };
            };



            function standardError(err) {
                return $q.reject(err);
            }

        }


    }

    angular.module("fb.services")
        .service("geoMngr", geoMngrService);
})();
