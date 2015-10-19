(function() {
    "use strict";
    var ArrMngr;

    angular.module("fireStarter.services")
        .factory("arrMngr", ArrMngrFactory);

    /** @ngInject */
    function ArrMngrFactory($firebaseArray, fbRef, fbHelper, $q, $log) {
        return function(path) {
            var fb = new ArrMngr($firebaseArray, fbRef, fbHelper, $q, $log, path);
            return fb.construct();
        };
    }

    /* constructor for fb arrays 
     * @param {Array of strings}
     * @return {$firebaseArray}
     */

    ArrMngr = function($firebaseArray, fbRef, fbHelper, $q, $log, path) {
        this._$firebase = $firebaseArray;
        this._fbRef = fbRef;
        this._fbHelper = fbHelper;
        this._q = $q;
        this._log = $log;
        this._path = path;
        this._arrayRef = this._fbRef.ref(this._path);
        this._firebaseArray = this._$firebase(this._arrayRef);
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
						arr.timestamp = timestamp;

            function add(obj) {
                return self._firebaseArray.$add(obj);
            }

            function destroy() {
                return self._firebaseArray.$destroy();
            }

            function getRecord(key) {
                return self._firebaseArray.$getRecord(key);
            }

            function indexFor(val) {
                return self._firebaseArray.$indexFor(val);
            }


            function keyAt(rec) {
                return self._firebaseArray.$keyAt(rec);
            }

            function loaded() {
                return self._firebaseArray.$loaded();
            }

            function ref() {
                // return self._firebaseArray.$ref();
                return self._arrayRef;
            }


            function remove(rec) {
                return self._firebaseArray.$remove();

            }

            function save(rec) {
                return self._firebaseArray.$save(rec);
            }

            function timestamp() {
                return self._fbHelper.timestamp();
            }


            self._arr = arr;
            return self._arr;
        }

    };


}.call(this));
