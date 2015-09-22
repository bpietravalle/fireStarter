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

        function save(fb, rec, result) {
            if (angular.isUndefined(result)) {
                return fb.$save(rec);
            } else {
                return fb.$save(rec)
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
                var newRec;
                newRec = forProperties(rec, data);
                return vm.save(newRec);

            } else {
                $q.reject("Record doesn't exist");
            }

        }

        function updateItem(rec, prop, val) {
            if (rec.hasOwnProperty(prop)) {
                rec[prop] = val;
            } else {
							//no like
                $q.reject("Property: " + prop + " is not present")
            }
        }


        function forProperties(rec, obj) {
            var i, key, str;
            i = 0;
            for (key in obj) {
                str = key.toString();
                updateItem(rec, str, obj[str]);
            }
            return rec;

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
