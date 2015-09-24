(function(angular) {
    "use strict";

    /** ngInject */
    function arrMngrService($q, afEntity, $log) {
        var vm = this;
        vm.add = add;
        vm.build = buildArray;
        vm.destroy = destroy;
        vm.getRecord = getRecord;
        vm.getNestedKey = getNestedKey;
        vm.keyAt = keyAt;
        vm.indexFor = indexFor;
        vm.loaded = loaded;
        vm.ref = ref;
        vm.remove = remove;
        vm.save = save;
        vm.updateNestedArray = updateNestedArray;
        vm.updateRecord = updateRecord;

        return vm;





        /* constructor for fb arrays 
         * @param {Array of strings(or objs that respond to toString()}
         * all 'path' args below are for the
         * @return Promise($firebaseArray)
         */
        function buildArray(path) {
            return $q.when(afEntity.set("array", path))
                .catch(standardError);
        }

        /* following functions are a simple wrapper around
         * $firebaseArray api
         */


        function add(path, obj) {
            return vm.build(path)
                .then(addSuccess)
                .catch(standardError);

            function addSuccess(res) {
                res.$add(obj);
            }
        }


        function destroy(path) {
            return vm.build(path)
                .then(destroySuccess)
                .catch(standardError);

            function destroySuccess(res) {
                res.$destroy();
            }

        }

        function getRecord(path, key) {
            return vm.build(path)
                .then(getRecordSuccess)
                .catch(standardError);

            function getRecordSuccess(res) {
                res.$getRecord(key);
            }
        }

        function indexFor(path, val) {
            return vm.build(path)
                .then(indexForSuccess)
                .catch(standardError);

            function indexForSuccess(res) {
                res.$indexFor(val);
            }
        }


        function keyAt(path, rec) {
            return vm.build(path)
                .then(keySuccess)
                .catch(standardError);

            function keySuccess(res) {
                return res.$keyAt(rec);
            }
        }

        function loaded(path) {
            return vm.build(path)
                .then(loadedSuccess)
                .catch(standardError);

            function loadedSuccess(res) {
                return res.$loaded();
            }
        }

        /* @param {$firebaseArray}
         * @return fb reference
         */
        function ref(fb) {
            return $q.when(fb.$ref())
                .catch(standardError);
        }


        function remove(path, rec) {
            return vm.build(path)
                .then(removeSuccess)
                .catch(standardError);

            function removeSuccess(res) {
                res.$remove(rec);
            }
        }

        function save(path, rec) {
            return vm.build(path)
                .then(saveSuccess)
                .catch(standardError);

            function saveSuccess(res) {
                return res.$save(rec);
            }
        }




        /* following functions use the above for convenience
         */

        //TODO: add constrain so only iterate over recent/active, etc items

        // var key = {
        // 	build: buildArray(path),
        // 	iterate: iterateOverColumns(arr, val, col),
        // 	checkArr: checkArray(key.iterate)
        // };

        // return $q.all(key)


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


        /* To keep the data structure flat, you need to store data in multiple places,
         * this helps me to quikcly access the nested primary key if:
         * I have the objects value and primarykey in the original node
         * @param {string}...the value of the nested obj
         * @param {string}..the column name that stores the foreignKey of the nested obj.
         * @param {Array of strings or stringable items}...path to nested array
         * @return {string}...primaryKey of nested obj
         */

        function getNestedKey(val, col, path) {
            return vm.build(path)
                .then(iterateOverColumns)
                .then(checkArray)
                .catch(standardError);

            function iterateOverColumns(res) {
                var nestedKey
                return $q.all(res.map(function(item) {
                    if (item[col] === val) {
                        nestedKey = item.$id;
                    }
                    return nestedKey;

                }));

            }

            function checkArray(res) {
                //TODO: make this unstupid, looking at first rec works for now
                // but needs to be foolproof
                //...perhaps $q.all again to see whats defined
                // var arr = res.sort(function(a, b){
																	// if (a.value > b.value){
																		// return 1;
																	// } else if( a.value < b.value){
																		// return -1;
																	// } else{
																		// return 0;
																	// }
								// });

                if (angular.isDefined(res.pop(0))) {
                    return res.pop(0);
                } else {
                    throw new Error("Foreign key: " + col + " with a value of: " + val + " was not found.");
                }

                function compare(a, b) {
                    return b - a;
                }


            }
        }



        function standardError(err) {
            return $q.reject(err);
        }

    }

    angular.module("fb.srvc.dataMngr")
        .service("arrMngr", arrMngrService);

})(angular);
