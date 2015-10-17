(function() {
    "use strict";

    /** @ngInject */
    function geoFireFactory(fbRef) {

			//TODO update specs
        var geo = {
            ref: ref
        };
        return geo;


        function ref(path) {
            if (angular.isDefined(path)) {
                return new GeoFire(fbRef.ref(path));
            } else {
                throw new Error("You must define a path to build a GeoFire object: " + path);
            }
        }
    }

    angular.module("utils.gfApi")
        .factory("geoRef", geoFireFactory);
})();
