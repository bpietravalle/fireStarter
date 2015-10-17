(function() {
    "use strict";
    var ObjMngr;

    angular.module("fireStarter.services")
        .factory("objMngr", objMngrFactory);

    /** @ngInject */
    function objMngrFactory($q, afEntity, $log) {


        return function(path) {
            var fb = new ObjMngr($q, afEntity, $log, path);
            return fb.construct();

        };

    }

    /* constructor for path objects
     * @param {Array of strings}
     * @return Promise($firebaseObject)
     */

    ObjMngr = function($q, afEntity, $log, path) {
        this._q = $q;
        this._afEntity = afEntity;
        this._log = $log;
        this._path = path;
        this._firebaseObject = this._q.when(this._afEntity.set("object", this._path));
    };

    ObjMngr.prototype = {
        construct: function() {
            var self = this;
            var obj = {};

            obj.bindTo = bindTo;
            obj.destroy = destroy;
            obj.id = id;
            obj.loaded = loaded;
            obj.ref = ref;
            obj.remove = remove;
            obj.save = save;
            obj.priority = priority;
            obj.timestamp = timestamp;
            obj.value = value;
            obj.updateRecord = updateRecord;


            function bindTo(s, v) {
                return self._firebaseObject
                    .then(buildForBind)
                    .catch(standardError);

                function buildForBind(res) {
                    return res.$bindTo(s, v);
                }
            }

            function destroy() {
                return self._firebaseObject
                    .then(destroySuccess)
                    .catch(standardError);

                function destroySuccess(res) {
                    return res.$destroy();
                }

            }

            function id() {
                return self._firebaseObject
                    .then(returnId)
                    .catch(standardError);

                function returnId(res) {
                    return res.$id();
                }
            }


            function loaded() {
                return self._firebaseObject
                    .then(completeLoad)
                    .catch(standardError);

                function completeLoad(res) {
                    return res.$loaded();
                }

            }

            function priority() {
                return self._firebaseObject
                    .then(checkPriority)
                    .catch(standardError);

                function checkPriority(res) {
                    return res.$priority;
                }

            }


            function ref() {
                return self._firebaseObject
                    .then(returnRef)
                    .catch(standardError);

                function returnRef(res) {
                    return res.$ref();
                }
            }

            function remove() {
                return self._firebaseObject
                    .then(attemptRemove)
                    .catch(standardError);

                function attemptRemove(res) {
                    return res.$remove();
                }

            }


            function save() {
                return self._firebaseObject
                    .then(attemptSave)
                    .catch(standardError);

                function attemptSave(res) {
                    return res.$save();
                }
            }

            function value() {
                return self._firebaseObject
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
                    return obj.save(path);
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
                    return obj.save(res);

                }
            }

            /* Helper functions
             */
            function standardError(err) {
                // $log.error(err);
                return self._q.reject(err);
            }

            //TODO: add test
            function timestamp() {
                return Firebase.ServerValue.TIMESTAMP;
            }

            self._obj = obj;
            return self._obj;
        }


    };



}.call(this));
