(function() {
    "use strict";
    var FireEntity;


    angular.module("fireStarter.services")
        .factory("fireEntity", FireEntityFactory);

    /** @ngInject */
    function FireEntityFactory($rootScope, fireStarter, firePath, $q, $log, inflector, $injector) {

        return function(path, options) {
            var fb = new FireEntity($rootScope, fireStarter, firePath, $q, $log, inflector, $injector, path, options);
            return fb.construct();
        };

    }


    FireEntity = function($rootScope, fireStarter, firePath, $q, $log, inflector, $injector, path, options) {
        this._rootScope = $rootScope;
        this._fireStarter = fireStarter;
        this._firePath = firePath;
        this._q = $q;
        this._log = $log;
        this._inflector = inflector;
        this._injector = $injector;
        this._path = path;
        this._options = options;
        this._nestedArrays = [];
        this._pathMaster = this._firePath(this._path);
        if (this._options) {
            this._geofire = false || this._options.geofire;
            if (this._options.nestedArrays) {
                if (!Array.isArray(this._options.nestedArrays)) {
                    throw new Error("Nested Arrays argument must be an array");
                } else {
                    this._nestedArrays = this._options.nestedArrays;
                }
            }
            if (this._geofire === true) {
                this._locationName = "locations"
                this._geofireObject = this._injector.get("geo");
                this._nestedArrays.push(this._locationName);
                this._locationPath = [this._locationName, this._path];
            }
            this._user = this._options.user || false;
            this._sessionAccess = this._options.sessionAccess || false;
            if (this._user === true) {
                this._userPath = "users";
                this._sessionAccess = true;
            }
            if (this._sessionAccess === true) {
                if (this._options.sessionLocation) {
                    this._sessionStorage = this._injector.get(this._options.sessionLocation);
                } else {
                    this._sessionStorage = this._rootScope.session;
                }
                if (this._options.sessionIdMethod) {
                    this._sessionIdMethod = this._options.sessionIdMethod;
                } else {
                    this._sessionIdMethod = "getId";
                }
            }
        }

    };


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
            entity.createMainRecord = createMainRecord;
            entity.createNestedRecord = createNestedRecord;
            entity.inspect = inspect;

            if (self._geofire === true) {
                entity.mainLocations = mainLocations;
                entity.mainLocation = mainLocation;
                entity.createLocationRecord = createLocationRecord;
                entity.createNestedLocationRecord = createNestedLocationRecord;
                entity.geofireSet = geofireSet;
                entity.geofireGet = geofireGet;
                entity.geofireRemove = geofireRemove;
                entity.trackLocation = trackLocation;
            }

            if (self._user === true) {
                entity.userNestedArray = userNestedArray;
                entity.userNestedRecord = userNestedRecord;
                entity.loadUserRecords = loadUserRecords;
                entity.createUserRecord = createUserRecord;
            }
            if (self._sessionAccess === true) {
                entity.session = session;
                entity.sessionId = sessionId;
            }

            switch (self._nestedArrays) {
                case []:
                    break;
                default:
                    return addNested(entity, self._nestedArrays);
            }


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

            function nestedRecord(mainId, name, recId) {
                return self._fireStarter("object", self._pathMaster.nestedRecord(mainId, name, recId));
            }


            /*Queries*/

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
                return nestedRecord(arr, id).loaded();
            }

            function loadUserRecords() {
                return userNestedArray()
                    .loaded()
                    .then(logSuccess)
                    .catch(standardError);
            }

            /*Commands*/

            function createMainRecord(data) {
                return mainArray().add(data);
            }


            function createNestedRecord(recId, name, data) {
                return nestedArray(recId, name).add(data);
            }



            /* save to user nested array 
             * @param{Object} data to save to user array
             *@return{Promise(fireBaseRef)}
             */

            function createUserRecord(data) {
                return userNestedArray()
                    .add(data)
                    .then(logSuccess)
                    .catch(standardError);

            }

            /* save to mainLocation array
             * @param{Object}
             */
            function createLocationRecord(data) {
                return mainLocations()
                    .add(data)
                    .then(logSuccess)
                    .catch(standardError);

            }

            /* save to a records nested location array
             * @param{string} id of mainArray record
             * @param{Object}
             */
            function createNestedLocationRecord(recId, data) {
							//cant call nestedArray methods in the constructor i guess
								return nestedArray(recId, self._locationName)
                    .add(data)
                    .then(logSuccess)
                    .catch(standardError);

            }


            function trackLocation(data) {

                return createLocationRecord(data.loc)
                    .then(sendToGeoFireAndNestedArray)
                    .catch(standardError);

                function sendToGeoFireAndNestedArray(res) {
                    return self._q.all([geoFireSet(res.key(), data.coords), locations().add({
                        key: res.key()
                    })]);

                }
            }



            function addNested(obj, arr) {
                var newProperties = {};

                self._q.all(arr.map(function(item) {
                    angular.extend(newProperties, addNestedArray(obj, item));
                }))

                return angular.merge({}, obj, newProperties);
            }

            function addNestedArray(obj, arr) {
                var arrName = self._inflector.pluralize(arr);
                var recName = self._inflector.singularize(arr);
                var newProp = {};

                newProp[arrName] = function(id) {
                    return nestedArray(id, arrName);
                }

                newProp[recName] = function(mainRecId, nestedRecId) {
                    return nestedRecord(mainRecId, arrName, nestedRecId);
                }

                return newProp;
            }



            /**
             * Geofire Interface **/

            /* private */
            function geoService() {
                return self._geofireObject;
            }

            function mainLocationsPath() {
                return self._firePath(self._locationPath);
            }

            /* public */
            function geofireSet(k, c) {
                return geoService().set(self._path, k, c);
            }

            function geofireGet(k) {
                return geoService().get(self._path, k);
            }

            function geofireRemove(k) {
                return geoService().remove(self._path, k);
            }

            function mainLocations() {
                return buildArray(mainLocationsPath().mainArray());
            }

            function mainLocation(id) {
                return buildObject(mainLocationsPath().mainRecord(id));
            }

            /**
             * User Interface **/


            /* private */
            function userNestedPath() {
                return self._firePath([self._userPath, sessionId(), self._path]);
            }

            /* public */
            function userNestedArray() {
                return buildArray(userNestedPath().mainArray());
            }

            function userNestedRecord(id) {
                return buildObject(userNestedPath().mainRecord(id));
            }

            function session() {
                return self._sessionStorage;
            }

            function sessionId() {
                return self._sessionStorage[self._sessionIdMethod]();
            }



						/** helpers 
						 * */


            function standardError(err) {
                return self._q.reject(err);
            }

            function logSuccess(res) {
                self._log.info(res)
                return res
            }

						function qWrap(obj){
							return self._q.when(obj);
						}

            /*to remove later on*/
            function inspect() {
                return self;
            }

            self._entity = entity;
            return self._entity;
        }
    };
}.call(this));
