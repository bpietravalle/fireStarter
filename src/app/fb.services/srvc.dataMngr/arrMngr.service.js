(function(angular) {
    "use strict";

    /** ngInject */
    function arrMngrService($q, $log) {
        var vm = this;
        vm.ref = ref;
        vm.load = load;
        vm.save = save;
        vm.remove = remove;
        vm.destroy = destroy;
        vm.add = add;
        vm.index = index;
        vm.updateItem = updateItem;
        vm.updateRecord = updateRecord;
        vm.get = getRec;
        vm.key = key;

        function ref(fb) {
            return fb.$ref();
        }

        function load(fb, result) {
            if (angular.isUndefined(result)) {
                return fb.$loaded();
            } else {
                return fb.$loaded(result.success, result.failure);
            }
        }

        function save(fb, i, result) {
            if (angular.isUndefined(result)) {
                return fb.$save(i);
            } else {
                return fb.$save(i)
                    .then(result.success, result.failure);
            }
        }

        function remove(fb, val, result) {
            if (angular.isUndefined(result)) {
                return fb.$remove(val);
            } else {
                return fb.$remove(val)
                    .then(result.success, result.failure);
            }
        }

        function updateRecord(fb, k, data) {
            var rec = vm.get(fb, k);
            if (rec !== null) {
                return forIn(rec, data);

            } else {
                $q.reject("Record doesn't exist");
            }

        }

        function updateItem(rec, prop, val) {
            // Object.assign({}, rec);// need to coerce val to object for ES5

            // Object.getOwnPropertyDescriptor(rec, prop);

            if (rec.hasOwnProperty(prop)) {
                rec[prop] = val;
								$log.info(rec + " has: " + prop);
            } else {
                $q.reject("Property: " + prop + "not present")
            }
        }


        function forIn(rec, obj) {
            var i, key, str;
            i = 0;
            for (key in obj) {
                str = key.toString();
                return vm.updateItem(rec, str, obj[str]);
            }
						return forIn;


        }


        function destroy(fb) {
            return fb.$destroy();
        }

        function key(fb, val) {
            return fb.$keyAt(val);
        }

        function getRec(fb, val) {
            return fb.$getRecord(val);
        }

        function index(fb, val) {
            return fb.$indexFor(val);
        }

        function add(fb, val, result) {
            if (angular.isUndefined(result)) {
                return fb.$add(val);
            } else {
                return fb.$add(val)
                    .then(result.success, result.failure);
            }
        }

    }

    angular.module("fb.srvc.dataMngr")
        .service("arrMngr", arrMngrService);

})(angular);
