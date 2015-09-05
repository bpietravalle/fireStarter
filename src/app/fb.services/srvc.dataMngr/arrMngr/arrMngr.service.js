(function(angular) {
    "use strict";

    function arrMngrService() {
        var vm = this;
        vm.ref = ref;
        vm.load = load;
        vm.save = save;
        vm.remove = remove;
        vm.destroy = destroy;
        vm.add = add;
        vm.index = index;
        vm.get = getRec;
        vm.key = key;

        function ref(fb) {
            return fb.$ref();
        };

        function load(fb, result) {
            if (angular.isUndefined(result)) {
                return fb.$loaded();
            } else {
                return fb.$loaded(result.success, result.failure);
            }
        };

        function save(fb, val, result) {
            if (angular.isUndefined(result)) {
                return fb.$save(val);
            } else {
                return fb.$save(val)
                    .then(result.success, result.failure);
            }
        };

        function remove(fb, val, result) {
            if (angular.isUndefined(result)) {
                return fb.$remove(val);
            } else {
                return fb.$remove(val)
                    .then(result.success, result.failure);
            }

        };

        function destroy(fb) {
            return fb.$destroy();
        };

        function key(fb, val) {
            return fb.$keyAt(val);
        };

        function getRec(fb, val) {
            return fb.$getRecord(val);
        };

        function index(fb, val) {
            return fb.$indexFor(val);
        };

        function add(fb, val, result) {
            if (angular.isUndefined(result)) {
                return fb.$add(val);
            } else {
                return fb.$add(val)
                    .then(result.success, result.failure);
            }
        };

    }

    arrMngrService.$inject = [];

    angular.module("srvc.dataMngr")
        .service("arrMngr", arrMngrService);

})(angular);
