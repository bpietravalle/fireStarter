(function() {
    "use strict";
    var ObjMngr;

    angular.module("fireStarter.services")
        .factory("objMngr", ObjMngrFactory);

    /** @ngInject */
    function ObjMngrFactory($q, afEntity, $log) {


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
                    return res.$id;
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
