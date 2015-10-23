(function() {
    "use strict";
    var FireEntity;


    angular.module("fireStarter.services")
        .factory("fireEntity", FireEntityFactory);

    /** @ngInject */
    function FireEntityFactory(fireStarter, firePath, $q, $log, inflector, $window) {

        return function(path, options) {
            var fb = new FireEntity(fireStarter, firePath, $q, $log, inflector, $window, path, options);
            return fb.construct();
        };

    }


    FireEntity = function(fireStarter, firePath, $q, $log, inflector, $window, path, options) {
        this._fireStarter = fireStarter;
        this._firePath = firePath;
        this._q = $q;
        this._log = $log;
        this._inflector = inflector;
        this._window = $window;
        this._path = path;
        this._options = options;
        if (this._options) {
            this._geofire = false || this._options.geofire;
            this._firePathOptions = null || this._options.firePath;
            if (this._options.nestedArrays) {
                if (!Array.isArray(this._options.nestedArrays)) {
                    throw new Error("Nested Arrays argument must be an array");
                } else {
                    this._nestedArrays = this._options.nestedArrays;
                }
            }
        }
        this._pathMaster = this._firePath(this._path, this._firePathOptions);
    };

    //TODO add options hash to determine if saving to user, geofire, etc.
    //

    FireEntity.prototype = {
        construct: function() {
            var self = this;
            var entity = {};


            entity.buildObject = buildObject;
            entity.buildArray = buildArray;

            entity.mainArray = mainArray;
            entity.mainRecord = mainRecord;
            entity.nestedArray = nestedArray;
            entity.nestedRecord = nestedRecord;

            entity.findById = findById;
            entity.loadById = loadById;


            /* Access to fireStarter */
            function buildObject(path, flag) {
                return self._fireStarter("object", path, flag);
            }

            function buildArray(path, flag) {
                return self._fireStarter("array", path, flag);
            }

            /* Registering firebase refs */

            function mainArray() {
                return self._fireStarter("array", self._pathMaster.mainArray());
            }

            function mainRecord(id) {
                return self._fireStarter("object", self._pathMaster.mainRecord(id));
            }

            function nestedArray(id, name) {
                return self._fireStarter("array", self._pathMaster.nestedArray(id, name));
            }

            function nestedRecord(nestedArr, id) {
                return self._fireStarter("object", self._pathMaster.nestedRecord(nestedArr, id));
            }


            /*Query Functions*/

            function findById(id) {
                return mainRecord(id);
            }

            function loadById(id) {
                return findById(id)
                    .loaded();
            }

            function loadArray(id, name) {
                return nestedArray(id, name).loaded();
            }

            function loadNestedRecord(arr, id) {
                return nestedRecord(arr, id)
            }


            function createNestedArrays(arrName) {
                var arr = self._inflector.pluralize(arrName);
								/**/
                entity["arr"] = function(id, arr) {
                    return nestedArray(id, arr);
                }
							 
                var rec = self._inflector.singularize(arrName);
                rec = self._inflector.camelize(rec);
                entity["rec"] = function(arrId, recId) {
                    return nestedRecord(entity['arr'](arrId), recId);
                }
            }


            if (self._nestedArrays && self._nestedArrays.length > 0) {
                return self._nestedArrays.forEach(createNestedArrays);
            }


            self._entity = entity;
            return self._entity;
        }
    };
}.call(this));
