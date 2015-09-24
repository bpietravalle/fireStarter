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

        /*
         */
        function buildArray(path) {
            return $q.when(afEntity.set("array", path))
                .catch(function(err) {
                    return $q.reject(err);
                });
        }

        function ref(fb) {
            return $q.when(fb.$ref())
                .catch(function(err) {
                    return $q.reject(err);
                });
        }

				
        function key(path, rec) {
            return vm.build(path)
                .then(function(res) {
                    return res.$keyAt(rec);
                })
                .catch(function(err) {
                    return $q.reject(err);
                });
        }

        function load(path) {
            return vm.build(path)
                .then(function(res) {
                    return res.$loaded();
                })
                .catch(function(err) {
                    return $q.reject(err);
                });
        }

        function save(path, rec) {
            return vm.build(path)
                .then(function(res) {
                    return res.$save(rec);
                })
                .catch(function(err) {
                    return $q.reject(err);
                });
        }

        function remove(path, val) {
            return vm.build(path)
                .then(function(res) {
                    res.$remove(val);
                })
                .catch(function(err) {
                    return $q.reject(err);
                });
        }

        function updateRecord(path, id, data) {
            return getRecord(path, id)
                .then(function(res) {
                    return forProperties(res, data)
                })
                .then(function(res) {
                    return vm.save(path, res);
                })
                .catch(function(err) {
                    return $q.reject(err);
                });
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
            return vm.build(path)
                .then(function(res) {
                    res.$destroy();
                })
                .catch(function(err) {
                    return $q.reject(err);
                });
        }


        function getRecord(path, val) {
            return vm.build(path)
                .then(function(res) {
                    res.$getRecord(val);
                })
                .catch(function(err) {
                    return $q.reject(err);
                });
        }

        function index(path, val) {
            return vm.build(path)
                .then(function(res) {
                    res.$indexFor(val);
                })
                .catch(function(err) {
                    return $q.reject(err);
                });
        }

        function add(path, val) {
            return vm.build(path)
                .then(function(res) {
                    res.$add(val);
                })
                .catch(function(err) {
                    return $q.reject(err);
                });
        }

        //untested - this fn doesnt seem to be worth the abstraction
        function updateNestedArray(val, col, path, data) {
            return getNestedKey(val, col, path)
                .then(function(res) {
                    return arrMngr
                        .updateRecord(path, res, data);
                })
                .catch(function(err) {
                    return $q.reject(err);
                });

        }

        function getNestedKey(val, col, path) {
            //TODO: add constrain so only iterate over recent/active, etc items
            return iterateOverColumns(val, col, path)
                .catch(function(err) {
                    return $q.reject(err);
                });
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

    }

    angular.module("fb.srvc.dataMngr")
        .service("arrMngr", arrMngrService);

})(angular);
