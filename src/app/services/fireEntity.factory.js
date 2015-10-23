(function() {
    "use strict";
    var FireEntity;

    angular.module("fireStarter.services")
        .factory("fireEntity", FireEntityFactory);

    /** @ngInject */
    function FireEntityFactory(fireStarter, firePath, $q, $log) {

        return function(path, options) {
            var fb = new FireEntity(fireStarter, firePath, $q, $log, path, options);
            return fb.construct();

        };

    }


    FireEntity = function(fireStarter, firePath, $q, $log, path, options) {
        this._fireStarter = fireStarter;
        this._firePath = firePath;
        this._q = $q;
        this._log = $log;
        this._path = path;
        this._options = options;
        if (this._options) {
            this._geofire = false || this._options.geofire;
            this._firePathOptions = null || this._options.firePath;
        }
        this._pathMaster = this._firePath(this._path, this._firePathOptions);
    };


    FireEntity.prototype = {
        construct: function() {
            var self = this;
            var entity = {};

            entity.buildObject = buildObject;
            entity.buildArray = buildArray;

						/* general fireStarter */
            function buildObject(path) {
                return self._fireStarter("object", path);
            }

            function buildArray(path) {
                return self._fireStarter("array", path);
            }


            self._entity = entity;
            return self._entity;
        }
    };
}.call(this));
