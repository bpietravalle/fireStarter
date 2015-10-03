(function(angular) {
    "use strict";

    /** @ngInject */
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
        vm.timestamp = timestamp;
        //
        // TODO: need to debug - somehow broke/ I think bc 
        // they construct an array after editing the record
        vm.updateNestedArray = updateNestedArray;
        vm.updateRecord = updateRecord;

        return vm;


        /* constructor for fb arrays 
         * @param {Array of strings}
         * all 'path' args below are for this param
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
                return res.$add(obj);
            }
        }


        function destroy(path) {
            return vm.build(path)
                .then(destroySuccess)
                .catch(standardError);

            function destroySuccess(res) {
                return res.$destroy();
            }

        }

				/*not worth the abstraction*/
        function getRecord(path, key) {
            return vm.build(path)
                .then(completeFn)
                .then(getRecSuccess)
                .catch(standardError);

            function completeFn(res) {
                return $q.all([tryGetRecord(res), storeArray(res)]);
            }

            function tryGetRecord(res) {
                return $q.when(res.$getRecord(key));
            }

            function storeArray(res) {
                //in case path arg is just array of strings
                return $q.when(res);
            }

            function getRecSuccess(res) {
                //if return the constructed $firebaseArray as well as the record,
                // then can use this fn to update records 
                return {
                    record: res[0],
                    array: res[1],
                };
            }


        }

        function indexFor(path, val) {
            return vm.build(path)
                .then(indexForSuccess)
                .catch(standardError);

            function indexForSuccess(res) {
                return res.$indexFor(val);
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


        /* @param {$firebaseArray}
         * @return fb reference
         */


        function remove(arr, rec) {
            return attemptRemove(arr, rec)
                .then(removeSuccess)
                .catch(standardError);

            function attemptRemove(arr, rec) {
                return arr.$remove(rec);
            }

            function removeSuccess(res) {
                return res;
            }
        }

        /* @param {$firebaseArray}
         * @return fb reference
         */

        function save(arr, rec) {
            return attemptSave(arr, rec)
                .then(saveSuccess)
                .catch(standardError);

            function attemptSave(arr, rec) {
                return arr.$save(rec);
            }

            function saveSuccess(res) {
                return res;
            }
        }


        /* following functions use the above for convenience
         */


        /* To keep the data structure flat, you need to store data in multiple places,
         * this helps me to quikcly access the nested primary key if:
         * I have the objects value and primarykey in the original node
         * @param {string}...the value of the nested obj
         * @param {string}..the column name that stores the foreignKey of the nested obj.
         * @param {Array of strings or stringable items}...path to nested array
         * @return {string}...primaryKey of nested obj
         */

        function getNestedKey(val, col, path) {
            //TODO: add constrain so only iterate over recent/active, etc items
            return vm.build(path)
                .then(iterateOverColumns)
                .then(checkArray)
                .catch(standardError);


            function iterateOverColumns(res) {
                var nestedKey = null;
                $q.all(res.map(function(item) {
                    if (item[col] === val) {
                        nestedKey = item.$id;
                    }
                }));
                return nestedKey;
            }

            function checkArray(res) {
                if (res !== null) {
                    return res;
                } else {
                    throw new Error("Foreign key: " + col + " with a value of: " + val + " was not found.");
                }

            }
        }

        /* @param {$firebaseArray}...
         * @param {String}..recid.
         * @param {Object}..js object where key = property id, value = updated value
         * @return {Promise(Ref)}...Promise with record's firebase ref
         */

        function updateRecord(path, id, data) {
            if (angular.isDefined(data)) {
                return updateRecordWithDataObj(path, id, data);
            } else {
                return vm.save(path, id); //$fbArray, $fbObject
            }
        }

        function updateRecordWithDataObj(path, id, data) {
            /* this does not work unless get record within the fn */
            return $q.when(id)
                .then(iterateOverData)
                .then(iterateSuccess)
                .catch(standardError);


            //TODO: if property doesn't exist than separate key/value pair and try to save new property separately
            function iterateOverData(res) {
                var key, str, keys;
                keys = Object.keys(data);

                $q.all(keys.map(function(key) {
                    str = key.toString();
                    res[str] = data[str];
                }));
                return res;
            }


            function iterateSuccess(res) {
                return vm.save(path, res);

            }
        }

        function updateNestedArray(val, col, path, data) {
            return vm.getNestedKey(val, col, path)
                .then(getKeySuccess)
                .catch(standardError);

            function getKeySuccess(res) {
                return vm.updateRecord(path, res, data);
            }
        }





        /* Helper functions
         */
        function standardError(err) {
            return $q.reject(err);
        }

        //TODO: add test
        function timestamp() {
            return Firebase.ServerValue.TIMESTAMP;
        }

    }

    angular.module("fb.services")
        .service("arrMngr", arrMngrService);

})(angular);
