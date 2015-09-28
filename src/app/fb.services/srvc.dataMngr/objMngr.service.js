(function(angular) {
    "use strict";

    /** @ngInject */
    function objMngrService($q, afEntity) {
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
        vm.updateRecord = updateRecord;

        return vm;

        /* constructor for path objects
         * @param {Array of strings(or objs that respond to toString()}
         * all 'path' args below are for this param
         * @return Promise($firebaseObject)
         */
        function buildObject(path) {
            //* TODO: allow ojects as well - afEntity.setRef() already allows it
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
                res.$destroy();
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
                .catch(standardError);

            function buildForLoad(res) {
                return res.$loaded();
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

        /* @param{Path}
         * @return{Promise(firebaseRef)}
         */
        function remove(path) {
            return vm.build(path)
                .then(buildForRemove)
                .catch(standardError);

            function buildForRemove(res) {
                return res.$remove();
            }

        }


        /* @param{$firebaseObject}
         * @return{Promise(firebaseRef)}
         */

        function save(fb) {
            return $q.when(buildForSave)
                .catch(standardError);

            function buildForSave(res) {
                return res.$save();
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
            return vm.loaded(path)
                .then(iterateOverData)
                .then(iterateSuccess)
                .catch(standardError);


            function iterateOverData(res) {
                var key, str, keys;
                keys = Object.keys(data)
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

                $q.all(keys.map(function(key) {
                    str = key.toString();
                    res[str] = data[str];
                }));
                return res;
            }

            function iterateSuccess(res) {
                return vm.save(res);

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

    angular.module("fb.srvc.dataMngr")
        .service("objMngr", objMngrService);



})(angular);
