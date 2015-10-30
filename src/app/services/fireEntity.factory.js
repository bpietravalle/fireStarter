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
        this._pathMaster = this._firePath(this._path, this._pathOptions);
        if (this._options) {
            this._pathFlag = false || this._options.pathFlag;
            if (this._pathFlag === true) {
                if (this._options.mockPath) {
                    this._firePath = this._options.mockPath;
                }
                if (this._options.mockRef) {
                    this._mockRef = this._options.mockRef;
                }
            }
            this._geofire = false || this._options.geofire;
            if (this._options.nestedArrays) {
                if (!Array.isArray(this._options.nestedArrays)) {
                    throw new Error("Nested Arrays argument must be an array");
                } else {
                    this._nestedArrays = this._options.nestedArrays;
                }
            }
            if (this._geofire === true) {
                this._locationName = "locations";
                this._geofireName = "geofire";
                this._nestedArrays.push(this._locationName);
                this._locationPath = [this._locationName, this._path];
                this._geofirePath = [this._geofireName, this._path];
            }
            this._user = this._options.user || false;
            this._sessionAccess = this._options.sessionAccess || false;
            if (this._user === true) {
                this._userPath = "users";
                this._sessionAccess = true;
            }
            if (this._sessionAccess === true) {
                if (!this._options.sessionLocation) {
                    this._sessionStorage = this._rootScope.session;
                } else {
                    this._sessionStorage = this._injector.get(this._options.sessionLocation);
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
            entity.loadMainFromUser = loadMainFromUser;
            entity.createMainRecord = createMainRecord;
            entity.removeMainRecord = removeMainRecord;
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
                entity.trackLocations = trackLocations;
                entity.untrackLocations = untrackLocations;
            }

            if (self._user === true) {
                entity.userNestedArray = userNestedArray;
                entity.userNestedRecord = userNestedRecord;
                entity.loadUserRecords = loadUserRecords;
                entity.createUserAndMain = createUserAndMain;
                entity.createUserRecord = createUserRecord;
                entity.removeUserRecord = removeUserRecord;
            }

            if (self._user === true && self._geofire === true) {
                entity.createWithUserAndGeo = createWithUserAndGeo;
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


            /* Access to firebase */
            function buildFire(type, path, flag) {
                if (self._pathFlag === true && self._mockRef) {
                    flag = self._pathFlag;
                    self._log.info(path.join('/'));
                    path = self._mockRef.child(path.join('/'));
                }
                return self._fireStarter(type, path, flag);
            }

            function buildObject(path, flag) {
                return buildFire("object", path, flag);
            }

            function buildArray(path, flag) {
                return buildFire("array", path, flag);
            }

            function buildGeo(path, flag) {
                return buildFire("geo", path, flag);
            }


            /* Registered firebase refs */

            function mainArray() {
                return buildArray(self._pathMaster.mainArray());
            }

            function mainRecord(id) {
                return buildObject(self._pathMaster.mainRecord(id));
            }

            function nestedArray(id, name) {
                return buildArray(self._pathMaster.nestedArray(id, name));
            }

            function nestedRecord(mainId, name, recId) {
                return buildObject(self._pathMaster.nestedRecord(mainId, name, recId));
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



            /*Commands*/

            function createMainRecord(data, geoFlag, userFlag) {
                if (geoFlag === true) {
                    delete data["geo"]
                }
                if (userFlag === true) {
                    data.uid = sessionId();
                }

                return mainArray()
                    .add(data)

            }

            function createNestedRecord(recId, name, data) {
                return nestedArray(recId, name).add(data);
            }

            function removeMainRecord(data) {

                return mainArray()
                    .remove(data)

            }


            /******************
             * Geofire Interface
             * *****************/

            /**
             * Two Parts:
             * 1.) provides access to store and retrieve coordinates in GeoFire
             * 2.) Any other location data(ie google place_id, etc, can be stored in a separate
             * firebase node (currently called "locations" and refered to as the mainLocations array) **/


            /* private */


            function mainLocationsPath() {
                return self._firePath(self._locationPath);
            }

            function geoService() {
                return buildGeo(self._firePath(self._geofirePath)
                    .mainArray());
            }


            /* public */
            function geofireSet(k, c) {
                return geoService().set(k, c)
                    .then(logSuccess)
                    .catch(standardError);
            }

            function geofireGet(k) {
                return geoService().get(k)
                    .then(logSuccess)
                    .catch(standardError);

            }

            function geofireRemove(k) {
                return geoService().remove(k)
                    .then(logSuccess)
                    .catch(standardError);
            }

            function mainLocations() {
                return buildArray(mainLocationsPath().mainArray());
            }

            function mainLocation(id) {
                return buildObject(mainLocationsPath().mainRecord(id));
            }


            /* save to mainLocation array
             * @param{Object}
             * @return{fireBaseRef}
             */

            function createLocationRecord(data, geoFlag) {
                return checkParams() //(data, geoFlag)
                    .then(addData)
                    .catch(standardError);

                function checkParams() {
                    // if (geoFlag === true) {
                    var c = new Coords();
                    c['lat'] = data.lat;
                    c['lon'] = data.lon;
                    return qWrap([data, c]);
                    // } else {
                    //     return qWrap(data);
                    // }
                }

                function addData(res) {
                    // if (angular.isArray(res)) {
                    return self._q.all([saveData(res[0]),
                        qWrap(res[1])
                    ]);
                    // } else {
                    // return mainLocations()
                    //     .add(res);
                    // }
                }

                function saveData(res) {
                    if (geoFlag === true) {
                        delete res['lon'];
                        delete res['lat'];
                    }

                    return mainLocations().add(res);
                }
            }

            function Coords(x, y) {
                this.lat = x;
                this.lon = y;
            }

            /* save to a record's nested location array
             * TODO add option so just saving an index
             * @param{string} id of mainArray record
             * @param{Object}
             */

            function createNestedLocationRecord(recId, data) {
                return nestedArray(recId, self._locationName)
                    .add(data)
                    .then(logSuccess)
                    .catch(standardError);

            }


            /*@param{Array} location objects to save.  each must have a lat and a lon property
             *@return{Array} [[null,fireBaseRef(main Location)]]
             */

            function trackLocations(data, key) {
                return self._q.all(data.map(function(item) {
                        return trackLocation(addLocationKey(item, key));
                    }))
                    .catch(standardError);

                function addLocationKey(obj, key) {
                    obj.mainArrayKey = key;
                    return obj;
                }
            }

            function trackLocation(data) {
                return createLocationRecord(data)
                    .then(sendToGeoFireAndPassLocationResults)
                    .catch(standardError);

                function sendToGeoFireAndPassLocationResults(res) {
                    return geofireSet(res[0].key(), [res[1].lat, res[1].lon]);

                }
            }

            /*@param{Array} pass keys 
             *@return{Array} [[null,fireBaseRef(main Location)]]
             */

            function untrackLocations(keys) {

                return self._q.all(keys.map(function(key) {
                        mainLocations().remove(key)
                            // .then(geofireRemove(key))
                            .catch(standardError);

                    }))
                    .catch(standardError);


            }

            function untrackLocation(keyOrRecord) {

            }


            /******************
             * User Record Interface
             * *****************/


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

            //TODO this needs to have option to simple 
            //load keys from userNestedArray and then
            //getRecords from the mainArray

            /* por ejemplo
										self._q.all(res.map(function(key){
										return mainArray().getRecord(key.mainArrayKey);
										}));


											 */

            function loadUserRecords() {
                return userNestedArray()
                    .loaded()
                    // .then(logSuccess)
                    .catch(standardError);
            }

            function loadMainFromUser(rec) {
                return mainArray()
                    .getRecord(rec.mainArrayKey);
            }

            function session() {
                return self._sessionStorage;
            }

            function sessionId() {
                return self._sessionStorage[self._sessionIdMethod]();
            }

            /* save to user nested array 
             * TODO add option so just saving an index
             * @param{Object} data to save to user array - just saving key for now
             *@return{Promise(fireBaseRef)}
             */

            function createUserRecord(d) {
                return userNestedArray()
                    .add({
                        mainArrayKey: d.key()
                    })
                    .then(logSuccess)
                    .catch(standardError);

            }

            function createUserAndMain(data, geoFlag) {
                return createMainRecord(data, geoFlag, true)
                    .then(createUserRecord)
                    .then(logSuccess)
                    .catch(standardError);
            }


            function removeUserRecord(rec) {

                return userNestedArray()
                    .remove(rec)
                    .catch(standardError);

            }

            /* Nested Arrays constructor
             */

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

            /*Combo Methods*/

            /* 1.) adds main array record
             * 2.) adds user nested record,
             * 3.) adds records to main location array for each location
             * 4.) adds coordinates to geofire(key used is mainLocation key)
             * 5.) updates main array record by adding nested locations array with mainLocation keys
             */

            //still needs more tests
            function createWithUserAndGeo(data, loc) {

                return self._q.all([createMainRecord(data, true, true), qWrap(loc)])
                    .then(trackLocationAndAddUserRec)
                    .then(addNestedLocations)
                    .catch(standardError);

                function trackLocationAndAddUserRec(res) {
                    return self._q.all([trackLocations(res[1], res[0].key()),
                        createUserRecord(res[0]), qWrap(res[0])
                    ]);
                }

                function addNestedLocations(res) {
                    return self._q.all(res[0].map(function(loc) {
                        return createNestedLocationRecord(res[2].key(), loc[1].key());
                    }));

                }

            }

            /** helpers **/

            function standardError(err) {
                return self._q.reject(err);
            }

            function logSuccess(res) {
                // self._log.info(res);
                return res;
            }

            function qWrap(obj) {
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
