(function() {
    "use strict";
    var ArrMngr;

    angular.module("fireStarter.services")
        .factory("arrMngr", ArrMngrFactory);

    /** @ngInject */
    function ArrMngrFactory($q, afEntity, $log) {
        return function(path) {
            var fb = new ArrMngr($q, afEntity, $log, path);
            return fb.construct();
        };
    }

    /* constructor for fb arrays 
     * @param {Array of strings}
     * @return {$firebaseArray}
     */

    ArrMngr = function($q, afEntity, $log, path) {
        this._q = $q;
        this._afEntity = afEntity;
        this._log = $log;
        this._path = path;
        this._firebaseArray = this._q.when(this._afEntity.set("array", this._path));
    };

    ArrMngr.prototype = {
        construct: function() {
            var self = this;
            var arr = {};

            arr.add = add;
            arr.destroy = destroy;
            arr.getRecord = getRecord;
            arr.keyAt = keyAt;
            arr.indexFor = indexFor;
            arr.loaded = loaded;
            arr.ref = ref;
            arr.remove = remove;
            arr.save = save;

            function add(obj) {
                return self._firebaseArray
                    .then(attemptAdd)
                    .catch(standardError);

                function attemptAdd(res) {
                    return res.$add(obj);
                }
            }

            function destroy() {
                return self._firebaseArray
                    .then(attemptDestroy)
                    .catch(standardError);

                function attemptDestroy(res) {
                    return res.$destroy();
                }
            }

            function getRecord(key) {
                return self._firebaseArray
                    .then(completeAction)
                    .catch(standardError);

                function completeAction(res) {
                    return res.$getRecord(key);

                }
            }

            function indexFor(val) {
                return self._firebaseArray
                    .then(getIndex)
                    .catch(standardError);

                function getIndex(res) {
                    return res.$indexFor(val);
                }
            }


            function keyAt(rec) {
                return self._firebaseArray
                    .then(getKey)
                    .catch(standardError);

                function getKey(res) {
                    return res.$keyAt(rec);
                }
            }

            function loaded() {
                return self._firebaseArray
                    .then(attemptLoad)
                    .catch(standardError);

                function attemptLoad(res) {
                    return res.$loaded();
                }
            }

            function ref() {
                return self._firebaseArray
                    .then(getRef)
                    .catch(standardError);

                function getRef(res) {
                    return res.$ref();
                }
            }


            function remove(rec) {
                return self._firebaseArray
                    .then(attemptRemove)
                    .catch(standardError);

                function attemptRemove(res) {
                    return res.$remove(rec);
                }

            }


            function save(rec) {
                return self._firebaseArray
                    .then(attemptSave)
                    .catch(standardError);

                function attemptSave(res) {
                    return res.$save(rec);
                }

            }

            function standardError(err) {
                return self._q.reject(err);
            }


            self._arr = arr;
            return self._arr;
        }

    };


}.call(this));
