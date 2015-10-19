(function() {
    "use strict";
    var ObjMngr;

    angular.module("fireStarter.services")
        .factory("objMngr", ObjMngrFactory);

    /** @ngInject */
    function ObjMngrFactory($firebaseObject, fbRef, fbHelper, $q, $log) {


        return function(path) {
            var fb = new ObjMngr($firebaseObject, fbRef, fbHelper, $q, $log, path);
            return fb.construct();

        };

    }

    /* constructor for path objects
     * @param {Array of strings}
     * @return Promise($firebaseObject)
     */

    ObjMngr = function($firebaseObject, fbRef, fbHelper, $q, $log, path) {
        this._$firebase = $firebaseObject;
        this._fbHelper = fbHelper;
        this._fbRef = fbRef;
        this._q = $q;
        this._log = $log;
        this._path = path;
        this._objectRef = this._fbRef.ref(this._path);
        this._firebaseObject = this._$firebase(this._objectRef);
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
            obj.path = path;
            obj.priority = priority;
            obj.timestamp = timestamp;
            obj.value = value;

            function bindTo(s, v) {
                return self._firebaseObject.$bindTo(s, v)
            }

            function destroy() {
                return self._firebaseObject.$destroy();

            }

            function id() {
                return self._firebaseObject.$id;
            }

            function loaded() {
                return self._firebaseObject.$loaded()
            }


            function path() {
                return self._path;
            }

            function priority() {
                return self._firebaseObject.$priority;

            }

            function ref() {
                // return self._firebaseObject.$ref();
                return self._objectRef;
            }

            function remove() {
                return self._firebaseObject.$remove()
            }


            function save() {
                return self._firebaseObject.$save()
            }

            function value() {
                return self._firebaseObject.$value

            }


            /* Helper functions
             */

            //TODO: add test
            function timestamp() {
                return self._fbHelper.timestamp();
            }

            self._obj = obj;
            return self._obj;
        }


    };



}.call(this));
