(function() {
    "use strict";

    /** @ngInject */
    function geoMngrService($geofire, $log, fbRef) {
        var vm = this;

        vm.field = field;
        vm.get = get;
        vm.remove = remove;
        vm.set = set;
        vm.query = query;

        vm.field = (function() {
            return new $geofire(fbRef.ref(GFURL));
        })();

        function get(k) {
            return vm.field
                .$get(k);
        }

        function query(data) {
            return vm.field
                .$query({
                    center: data.center,
                    radius: data.radius
                });
        }


        function remove(k) {
            return vm.field
                .$remove(k);
        }

        function set(k, c) {
            return vm.field
                .$set(k, c);
        }



    }

    angular.module("fb.services")
        .service("geoMngr", geoMngrService);
})();
