(function() {
    "use strict";
    var FireEntity;


    angular.module("fireStarter.services")
        .factory("fireEntity", FireEntityFactory);

    /** @ngInject */
    function FireEntityFactory(fireStarter, firePath, $q, $log, inflector, $injector) {

        return function(path, options) {
            var fb = new FireEntity(fireStarter, firePath, $q, $log, inflector, $injector, path, options);
            return fb.construct();
        };

    }


    FireEntity = function(fireStarter, firePath, $q, $log, inflector, $injector, path, options) {
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
                    this._sessionStorage = this._injector.get("session");
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

            entity.preActionRef = getPreActionRef; 
            entity._preActionRefHistory = [];
            entity.preActionRefHistory = getPreActionRefHistory;

            entity.currentRef = getCurrentRef;

            entity.postActionRef = getPostActionRef; 
            entity._postActionRefHistory = [];
            entity.postActionRefHistory = getPostActionRefHistory;

            entity.getIndex = getIndex;
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
                entity.trackLocation = trackLocation;
                entity.untrackLocations = untrackLocations;
                entity.untrackLocation = untrackLocation;
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

            /*******************
             * fireBaseRef Mngt
             * *******************/

            /* Current */
            function getCurrentRef() {
                return entity._currentRef;
            }

            function setCurrentRef(ref, type) {
                entity._currentRef = ref; //angular.extend({}, {
                // type: ref
                // });
                return entity._currentRef;
            }

            /* Pre Action */
            function getPreActionRef() {
                return entity._preActionRef;
            }

            function getPreActionRefHistory() {
                return entity._preActionRefHistory;
            }

            function setPreActionRef(ref) {
                if (angular.isObject(entity._preActionRef)) {
                    //if return is from qAll need to check for that; bc method below won't work
                    setPreActionRefHistory(entity._preActionRef.path);
                }

                entity._preActionRef = ref
                setCurrentRef(entity._preActionRef, "pre");
                return entity._preActionRef;
            }

            function setPreActionRefHistory(path) {
                entity._preActionRefHistory.push(path);
                return entity._preActionRefHistory;
            }


            /* postAction */

            function getPostActionRef() {
                return entity._postActionRef;
            }

            function getPostActionRefHistory() {
                return entity._postActionRefHistory;
            }

            function setPostActionRef(ref) {
                if (angular.isObject(entity._postActionRef)) {
                    if (angular.isDefined(entity._postActionRef.path)) {
                        setPostActionRefHistory(entity._postActionRef.path);
                    } else if (Array.isArray(entity._postActionRef)) {
                        var history = [];
                        self._q.all(entity._postActionRef.map(function(ref) {
                                if (angular.isDefined(ref.path)) {
                                    history.push(ref.path);
                                }
                            }))
                            .then(function(res) {
                                self._log.info(res);
                                setPostActionRefHistory(history);
                            })
                            .catch(standardError);

                    }
                }

                entity._postActionRef = ref
                setCurrentRef(entity._postActionRef, "post");
                return entity._postActionRef;
            }

            function setPostActionRefHistory(path) {
                entity._postActionRefHistory.push(path);
                return entity._postActionRefHistory;
            }


            /*******************
             * Access to firebase
             * *******************/

            function buildFire(type, path, flag) {
                self._log.info("building a firebaseRef");

                return self._q.when(self._fireStarter(type, path, flag))
                    .then(setPreActionRefAndReturn)
                    .catch(standardError)

                function setPreActionRefAndReturn(res) {
                    setPreActionRef(res.ref());
                    return res;
                }
            }

            function buildObject(path, flag) {
                return buildFire("object", path, flag)
                    .catch(standardError);
            }

            function buildArray(path, flag) {
                return buildFire("array", path, flag)
                    .catch(standardError);
            }

            function buildGeo(path, flag) {
                return buildFire("geo", path, flag)
                    .catch(standardError);
            }


            /*********************
             * Methods that create
             * a fireBaseRef
             * ********************/

            /* 
             * @return{Promise(fireStarter)} returns a configured firebaseObj, firebaseArray, or a Geofire object
             */

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

            /* Geofire Interface */


            function mainLocations() {
                return buildArray(mainLocationsPath().mainArray());
            }

            function mainLocation(id) {
                return buildObject(mainLocationsPath().mainRecord(id));
            }


            function geoService() {
                return buildGeo(self._firePath(self._geofirePath)
                    .mainArray());
            }

            /* User Interface */


            function userNestedArray() {
                return buildArray(userNestedPath().mainArray());
            }

            function userNestedRecord(id) {
                return buildObject(userNestedPath().mainRecord(id));
            }



            /*****************
             * General Methods
             * ***************/

            /*Queries*/

            function loadArray(id, name) {
                return nestedArray(id, name)
                    .then(loadResult)
                    .catch(standardError);
            }

            function loadNestedRecord(arr, id) {
                return nestedRecord(arr, id)
                    .then(loadResult)
                    .catch(standardError);
            }

            /*Commands*/

            function createMainRecord(data, geoFlag, userFlag) {
                if (geoFlag === true && data.geo) {
                    delete data["geo"]
                }
                if (userFlag === true) {
                    data.uid = sessionId();
                }

                return qAll(mainArray(), data)
                    .then(addTo)
                    .then(commandSuccess)
                    .catch(standardError);
            }

            function createNestedRecord(recId, name, data) {
                return qAll(nestedArray(recId, name), data)
                    .then(addTo)
                    .then(commandSuccess)
                    .catch(standardError);

            }

            function removeMainRecord(data) {
                return qAll(mainArray(), data)
                    .then(removeFrom)
                    .then(commandSuccess)
                    .catch(standardError);
            }


            /******************
             * Geofire Interface
             * *****************/

            /**
             * Two Parts:
             * 1.) provides access to store and retrieve coordinates in GeoFire
             * 2.) Any other location data(ie google place_id, etc, can be stored in a separate
             * firebase node (currently called "locations" and refered to as the mainLocations array) **/


            /* public */

            function geofireSet(k, c) {
                return qAll(geoService(), [k, c])
                    .then(completeAction)
                    .catch(standardError);

                function completeAction(res) {
                    return res[0].set(res[1][0], res[1][1]);
                }
            }

            function geofireGet(k) {
                return qAll(geoService(), k)
                    .then(getIn)
                    .catch(standardError);
            }

            function geofireRemove(k) {
                return qAll(geoService(), k)
                    .then(removeFrom)
                    .catch(standardError);
            }


            /* save to mainLocation array
             * @param{Object}
             * @return{fireBaseRef}
             */

            function createLocationRecord(data, geoFlag) {
                return qAll(mainLocations(), data)
                    .then(addDataAndPass)
                    .then(commandSuccess)
                    .catch(standardError);


                function addDataAndPass(res) {
                    return qAll(addTo(res), {
                        lat: res[1].lat,
                        lon: res[1].lon
                    });
                }
            }

            // function Coords(x, y) {
            //     this.lat = x;
            //     this.lon = y;
            // }

            /* save to a record's nested location array
             * TODO add option so just saving an index
             * @param{string} id of mainArray record
             * @param{Object}
             */

            function createNestedLocationRecord(recId, data) {
                return qAll(nestedArray(recId, self._locationName), data)
                    .then(addTo)
                    .then(commandSuccess)
                    .catch(standardError);

            }


            /*@param{Array} location objects to save.  each must have a lat and a lon property
             *@return{Array} [[null,fireBaseRef(main Location)]]
             */

            function trackLocations(data, key) {
                return self._q.all(data.map(function(item) {
                        return trackLocation(item, key);
                    }))
                    .catch(standardError);

            }

            function trackLocation(data, key) {
                return createLocationRecord(addLocationKey(data, key))
                    .then(sendToGeoFireAndPassLocationResults)
                    .then(commandSuccess)
                    .catch(standardError);

                function sendToGeoFireAndPassLocationResults(res) {
                    return qAll(geofireSet(res[0].key(), [res[1].lat, res[1].lon]), res[0]);

                }

                function addLocationKey(obj, key) {
                    obj.mainArrayKey = key;
                    return obj;
                }
            }

            /*@param{Array} pass keys 
             *@return{Array} [[null,fireBaseRef(main Location)]]
             */

            function untrackLocations(keys) {

                return self._q.all(keys.map(function(key) {
                        return untrackLocation(key)
                            .catch(standardError);
                    }))
                    .catch(standardError);


            }

            function untrackLocation(key) {


                return qAll(getIndex(mainLocations(), key), key)
                    .then(removeMainAndPassKey)
                    .then(removeCoords)
                    .then(commandSuccess)
                    .catch(standardError);

                // function removeMainAndPassKey(res) {

                // return qAll(removeFrom(res), res[1]);
                // }

                // function removeCoords(res) {
                // return geofireRemove(res[1]);
                // }
            }

            function getIndex(arr, key) {
                return qAll(arr, key)
                    .then(completeAction)
                    .catch(standardError);

                function completeAction(res) {
                    return res[0].indexFor(res[1]);
                }
            }



            /******************
             * User Record Interface
             * *****************/



            //TODO this needs to have option for saving as index

            function loadUserRecords() {
                return userNestedArray()
                    .then(loadResult)
                    .catch(standardError);
            }

            function loadMainFromUser(rec) {
                return mainArray()
                    .then(completeAction)
                    .catch(standardError);

                function completeAction(res) {
                    return res.getRecord(rec.mainArrayKey);
                }
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
                return qAll(userNestedArray(), {
                        mainArrayKey: d.key()
                    })
                    .then(addTo)
                    .then(commandSuccess)
                    .catch(standardError);
            }

            function createUserAndMain(data, geoFlag) {
                return createMainRecord(data, geoFlag, true)
                    .then(createUserRecord)
                    .catch(standardError);
            }


            function removeUserRecord(rec) {

                return qAll(userNestedArray(), rec)
                    .then(removeFrom)
                    .then(commandSuccess)
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

                return qAll(createMainRecord(data, true, true), loc)
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

            /****************
             **** Helpers ****/


            /** For constructing user and location paths**/
            function userNestedPath() {
                return self._firePath([self._userPath, sessionId(), self._path]);
            }

            function mainLocationsPath() {
                return self._firePath(self._locationPath);
            }

            /** upon loading a firebase **/

            function loadResult(res) {
                return res.loaded();
            }

            //assume using qAll method below

            function addTo(res) {
                return res[0].add(res[1]);
            }

            function removeFrom(res) {
                return res[0].remove(res[1]);
            }

            function getIn(res) {
                return res[0].get(res[1]);
            }


            function standardError(err) {
                return self._q.reject(err);
            }

            function commandSuccess(res) {
                setPostActionRef(res);
                return res;
            }

            function querySuccess(res) {
                self._log.info(res);
                //what should return? to log ref history 
                return res;
            }

            function qWrap(obj) {
                return self._q.when(obj);
            }

            function qAll(x, y) {
                return self._q.all([x, qWrap(y)]);
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
