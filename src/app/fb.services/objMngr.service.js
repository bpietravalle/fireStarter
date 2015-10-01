(function(angular) {
    "use strict";

    /** @ngInject */
    function objMngrService($q, afEntity, $log) {
        var vm = this;

        vm.bindTo = bindTo;
        vm.build = buildObject;
        vm.destroy = destroy;
        vm.id = id;
        vm.loaded = loaded;
        vm.ref = ref;
        vm.remove = remove;
        vm.save = save;
        vm.priority = priority;
        vm.timestamp = timestamp;
        vm.value = value;
				// TODO: need to debug - somehow broke/ I think bc 
				// it constructs an array after editing the record
        vm.updateRecord = updateRecord;

        return vm;

        /* constructor for path objects
         * @param {Array of strings}
         * all 'path' args below are for this param
         * @return Promise($firebaseObject)
         */
        function buildObject(path) {
            return $q.when(afEntity.set("object", path))
                .catch(standardError);
        }

        /* following functions are a simple wrapper around
         * $firebaseObject api
         */

        function bindTo(path, s, v) {
            return vm.build(path)
                .then(buildForBind)
                .catch(standardError);

            function buildForBind(res) {
                return res.$bindTo(s, v);
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

        /* @param{$firebaseObject}
         * @return{Promise(string)}...key of object
         */

        function id(fb) {
            return $q.when(returnId)
                .catch(standardError);

            function returnId(fb) {
                return fb.$id();
            }
        }


        function loaded(path) {
            return vm.build(path)
                .then(buildForLoad)
                .then(loadSuccess)
                .catch(standardError);

            function buildForLoad(res) {
                return res.$loaded();
            }

            function loadSuccess(res) {
                return res;
            }
        }

        function priority(path) {
            return vm.build(path)
                .then(buildForPriority)
                .catch(standardError);

            function buildForPriority(res) {
                return res.$priority;
            }

        }

        /* @param{$firebaseObject}
         * @return{Promise(string)}...ref of object
         */

        function ref(fb) {
            return $q.when(returnRef)
                .catch(standardError);

            function returnRef(fb) {
                return fb.$ref();
            }
        }

        /* @param{$firebaseObject}
         * @return{Promise(firebaseRef)}
         */
        function remove(obj) {
            return attemptRemove(obj)
                .then(removeSuccess)
                .catch(standardError);

            function attemptRemove(res) {
                return $q.when(res.$remove());
            }

            function removeSuccess(res) {
                return res;
            }


        }


        /* @param{$firebaseObject}
         * @return{Promise(firebaseRef)}
         */

        function save(obj) {
            return attemptSave(obj)
                .then(saveSuccess)
                .catch(standardError);

            function attemptSave(res) {
                return $q.when(res.$save());
            }

            function saveSuccess(res) {
                return res;
            }

        }

        function value(path) {
            return vm.build(path)
                .then(buildForValue)
                .catch(standardError);

            function buildForValue(res) {
                return res.$value;
            }

        }


        //TODO: if property doesn't exist than separate key/value pair and try to save separately
        function updateRecord(path, data) {
            if (angular.isDefined(data)) {
                return updateRecordWithDataObj(path, data);
            } else {
                return vm.save(path);
            }

        }

        function updateRecordWithDataObj(path, data) {
            return setupForUpdate()
                .then(iterateOverData)
                .then(iterateSuccess)
                .catch(standardError);


            function setupForUpdate() {
                return $q.all([loadObject(path), buildKeys(data)])

            }

            function loadObject(res) {
                return vm
                    .loaded(res);
            }

            function buildKeys(res) {
                var obj = {
                    keys: Object.keys(res),
                    data: res
                }

                return $q.when(obj);
                //TODO test code below for older browsers; from coderwall.com
                // if (!Object.keys) Object.keys = function(o) {
                //     if (o !== Object(o))
                //         throw new TypeError('Object.keys called on a non-object');
                //     var k = [],
                //         p;
                //     for (p in o)
                //         if (Object.prototype.hasOwnProperty.call(o, p)) k.push(p);
                //     return k;
                // };

            }


            //TODO: change it back to how fn appears in arrMngr
            function iterateOverData(res) {
                var obj, str, keys, dataSet;

                keys = res[1].keys;
                dataSet = res[1].data;
                obj = res[0];

                return $q.all(keys.map(function(key) {
                        str = key.toString();
                        obj[str] = dataSet[str];
                    }))
                    .then(returnObj);

                function returnObj(res) {
                    return obj;
                }
            }

            function iterateSuccess(res) {
                return vm.save(res);

            }
        }

        /* Helper functions
         */
        function standardError(err) {
            $log.error(err);
            return $q.reject(err);
        }

        //TODO: add test
        function timestamp() {
            return Firebase.ServerValue.TIMESTAMP;
        }

    }

    angular.module("fb.services")
        .service("objMngr", objMngrService);



})(angular);
