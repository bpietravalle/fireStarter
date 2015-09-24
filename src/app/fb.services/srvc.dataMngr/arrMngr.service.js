(function(angular) {
    "use strict";

    /** ngInject */
    function arrMngrService($q, afEntity, $log) {
        var vm = this;
        vm.ref = ref;
        vm.load = load;
        vm.save = save;
        vm.remove = remove;
        vm.destroy = destroy;
        vm.add = add;
        vm.index = index;
        vm.updateRecord = updateRecord;
        vm.getRecord = getRecord;
        vm.updateNestedArray = updateNestedArray;
        vm.getNestedKey = getNestedKey;
        vm.key = key;
        vm.build = buildArray;

        return vm;
        /*
         */
        function buildArray(path) {
            return $q.when(afEntity.set("array", path))
                .catch(standardError);
        }


        function ref(fb) {
            return $q.when(fb.$ref())
                .catch(standardError);
        }


        function key(path, rec) {
            return vm.build(path)
                .then(function(res) {
                    return res.$keyAt(rec);
                })
                .catch(standardError);
        }

        function load(path) {
            return vm.build(path)
                .then(function(res) {
                    return res.$loaded();
                })
                .catch(standardError);
        }

        function save(path, rec) {
            return vm.build(path)
                .then(function(res) {
                    return res.$save(rec);
                })
                .catch(standardError);
        }

        function remove(path, rec) {
            return vm.build(path)
                .then(function(res) {
                    res.$remove(rec);
                })
                .catch(standardError);
        }

        function destroy(path) {
            return vm.build(path)
                .then(function(res) {
                    res.$destroy();
                })
                .catch(standardError);
        }


        function getRecord(path, key) {
            return vm.build(path)
                .then(function(res) {
                    res.$getRecord(key);
                })
                .catch(standardError);
        }

        function index(path, val) {
            return vm.build(path)
                .then(function(res) {
                    res.$indexFor(val);
                })
                .catch(standardError);
        }

        function add(path, val) {
            return vm.build(path)
                .then(function(res) {
                    res.$add(val);
                })
                .catch(standardError);
        }

				/*
				 */
        function updateRecord(path, id, data) {
            return getRecord(path, id)
                .then(function(res) {
                    return forProperties(res, data)
                })
                .then(function(res) {
                    return vm.save(path, res);
                })
                .catch(standardError);
        }


        function updateItem(rec, prop, val) {
            rec[prop] = val;
        }


        function forProperties(rec, obj) {
            var key, str;
            for (key in obj) {
                str = key.toString();
                updateItem(rec, str, obj[str]);
            }
            return rec;
        }


        //untested - this fn doesnt seem to be worth the abstraction
        function updateNestedArray(val, col, path, data) {
            return getNestedKey(val, col, path)
                .then(function(res) {
                    return arrMngr
                        .updateRecord(path, res, data);
                })
                .catch(standardError);

        }

        function getNestedKey(val, col, path) {
            //TODO: add constrain so only iterate over recent/active, etc items
            return iterateOverColumns(val, col, path)
                .catch(standardError);
        }

        function iterateOverColumns(val, col, path) {
            var nestedKey;
            return vm.build(path)
                .then(function(res) {
                    res.forEach(function(item) {
                        if (item[col] === val) {
                            nestedKey = item.$id;
                        }
                    });
                    if (nestedKey) {
                        return nestedKey;
                    } else {
                        throw new Error("Foreign key: " + col + " with a value of " + val + " was not found.");
                    }
                });
        }

        function standardError(err) {
            return $q.reject(err);
        }

    }

    angular.module("fb.srvc.dataMngr")
        .service("arrMngr", arrMngrService);

})(angular);
