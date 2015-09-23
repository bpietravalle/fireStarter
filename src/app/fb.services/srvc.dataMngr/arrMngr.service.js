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
        vm.getNestedKey = getNestedKey;
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

        function updateRecord(rec, data) {
            return $q.when(forProperties(rec, data))
                .then(function(response) {
                    return vm.save(response);
                })
                .catch(function(err) {
                    $q.reject(err)
                });
        }



        function updateItem(rec, prop, val) {
            rec[prop] = val;
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


				//untested
        function updateNestedArray(val, col, arr, data) {
            return $q.when(getNestedKey(val, col, arr))
                .then(function(response) {
                    return vm.getRec(arr, response);
                })
                .then(function(response) {
                    return arrMngr
                        .updateRecord(response, data);
                })
                .catch(function(err) {
                    return $q.reject(err);
                });

        }

        function getNestedKey(val, col, arr) {
            //TODO: only iterate over active/recent items
            return $q.when(iterateOverColumns(val, col, arr))
                .then(function(response) {
                    return response;
                })
                .catch(function(err) {
                    return $q.reject(err);
                });
        }

        function iterateOverColumns(val, col, arr) {
            var nestedKey;
            arr.forEach(function(item) {
                if (item[col] === val) {
                    nestedKey = item.$id;
                }
            });
            if (nestedKey !== null) {
                return nestedKey;
            } else {
                throw new Error("Foreign key: " + col + " with a value of " + val + " was not found.");
            }
        }
    }

    angular.module("fb.srvc.dataMngr")
        .service("arrMngr", arrMngrService);

})(angular);
