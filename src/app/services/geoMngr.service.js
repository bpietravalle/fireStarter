(function() {
    "use strict";

    /** @ngInject */
    function geoMngrService($geofire, $q, $log, fbRef) {
        var vm = this;

        vm.field = geoField;
        vm.get = get;
        vm.remove = remove;
        vm.set = set;
        vm.query = query;

        // vm.field = (function() {
        //     return new $geofire(fbRef.ref(GFURL));
        // })();

        function geoField(str) {
            return $q.when(new $geofire(fbRef.ref(str)));
        }

        function get(obj, k) {
            return $q.when(obj.$get(k));
        }

        function query(obj, data) {
            return obj.$query({
                center: data.center,
                radius: data.radius
            });
        }


        function remove(obj, k) {
            return $q.when(obj.$remove(k));
        }

        function set(obj, k, c) {
            return $q.when(obj.$set(k, c));
        }



    }

    angular.module("fb.services")
        .service("geoMngr", geoMngrService);
})();
