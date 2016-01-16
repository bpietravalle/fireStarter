(function() {
    "use strict";
    angular.module("firebase.starter")
        .service("geofire", geofireFactory);

    /** @ngInject */
    function geofireFactory($window) {
        var root = $window.GeoFire;
        var geo = {
            distance: root.distance,
            init: init
        };
        return geo;

        function init(ref) {
            return new root(ref);
        }

    }

})();
