(function() {
    "use strict";
    var FireStarter;

    angular.module("fireStarter.services")
        .factory("fireStarter", FireStarterFactory);

    /** @ngInject */
    function FireStarterFactory($timeout, afEntity, fbHelper, $q, $log) {


        return function(path, flag) {
            var fb = new FireStarter($timeout, afEntity, $q, $log, path, type, flag);
            return fb.construct(type);

        };

    }

    /* constructor for path objects
     * @param {Array of strings}
     * @return Promise($firebaseObject)
     */

    FireStarter = function($timeout, afEntity, $q, $log, path, type, flag) {
        this._timeout = $timeout;
        this._afEntity = afEntity;
        this._type = type;
        this._flag = flag;
        this._q = $q;
        this._log = $log;
        this._path = path;
        this._firebase = this._afEntity.set(this._type, this._path, this._flag)
    };

    FireStarter.prototype = {
        construct: function(type) {
            var self = this;
            var obj = {};

            obj.bindTo = bindTo;
            obj.destroy = destroy;
            obj.id = id;
            obj.loaded = loaded;
            obj.ref = ref;
            obj.remove = remove;
            obj.save = save;
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
                return Firebase.SERVER_VALUE.timestamp;
            }

            self._firebase = firebase;
            return self._firebase;
        }


    };



}.call(this));
