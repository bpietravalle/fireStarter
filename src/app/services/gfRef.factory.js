(function() {
    "use strict";

    function geoFireFactory(fbRef) {

        return function(path) {
            return new GeoFire(fbRef.ref(path));
        }
    }

    angular.module("fb.services")
        .factory("gfRef", geoFireFactory);
})();
