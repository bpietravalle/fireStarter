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
        vm.get = getRec;
        vm.updateNestedArray = updateNestedArray;
        vm.getNestedKey = getNestedKey;
        vm.key = key;
        vm.buildArr = buildArr;

        function buildArr(path) {
            return $q.when(afEntity.set("array", path))
                .then(function(res) {
                    return res;
                })
                .catch(standardError);
        }

        function ref(fb) {
            return $q.when(fb.$ref());
        }

        function load(path) {
            return buildArr(path)
                .then(function(res) {
                    return res.$loaded();
                })
                .catch(standardError);
        }

        function save(path, rec) {
            return buildArr(path)
                .then(function(res) {
                    return res.$save(rec);
                })
                .catch(standardError);
        }

        function remove(path, val) {
            return buildArr(path)
                .then(function(res) {
                    res.$remove(val);
                })
                .catch(standardError);
        }

        function updateRecord(path, id, data) {
            //TODO: remove $q.when
            return $q.when(getRecord(path, id))
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


        function destroy(path) {
            return path.$destroy();
        }

        function key(fb, val) {
            return fb.$keyAt(val);
        }

        function getRec(path, val) {
            return buildArr(path)
                .then(function(res) {
                    res.$getRecord(val);
                })
                .catch(standardError);
        }

        function index(path, val) {
            return buildArr(path)
                .then(function(res) {
                    res.$indexFor(val);
                })
                .catch(standardError);
        }

        function add(path, val, result) {
            return buildArr(path)
                .then(function(res) {
                    res.$add(val);
                })
                .catch(standardError);
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
            //TODO: remove $q.when()
            return $q.when(iterateOverColumns(val, col, path))
                .then(function(res) {
                    return res;
                })
                .catch(standardError);
        }

        function iterateOverColumns(val, col, path) {
            var nestedKey;
            return buildArr(path)
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

        function standarError(err) {
            return $q.reject(err);
        }
    }

    angular.module("path.srvc.dataMngr")
        .service("arrMngr", arrMngrService);

})(angular);
