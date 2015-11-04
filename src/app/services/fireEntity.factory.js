(function() {
    "use strict";
    var FireEntity;


    angular.module("fireStarter.services")
        .factory("fireEntity", FireEntityFactory);

    /** @ngInject */
    function FireEntityFactory($timeout, fireStarter, firePath, $q, $log, inflector, $injector) {

        return function(path, options) {
            var fb = new FireEntity($timeout, fireStarter, firePath, $q, $log, inflector, $injector, path, options);
            return fb.construct();
        };

    }

    FireEntity = function($timeout, fireStarter, firePath, $q, $log, inflector, $injector, path, options) {
        this._timeout = $timeout;
        this._fireStarter = fireStarter;
        this._firePath = firePath;
        this._q = $q;
        this._log = $log;
        this._inflector = inflector;
        this._injector = $injector;
        this._path = path;
        this._options = options;
        this._nestedArrays = [];
        this._pathOptions = {};
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
                this._locationName = "locations";
                this._geofireName = "geofire";
                this._nestedArrays.push(this._locationName);
                this._locationPath = [this._locationName, this._path];
                this._geofirePath = [this._geofireName, this._path];
                this._pathOptions.geofire = true;
                this._pathOptions.locationName = this._locationName;
                this._pathOptions.geofireName = this._geofireName;
            }
            this._user = this._options.user || false;
            this._sessionAccess = this._options.sessionAccess || false;
            if (this._user === true) {
                this._userPath = "users";
                this._sessionAccess = true;
            }
            if (this._sessionAccess === true) {
                this._pathOptions.sessionAccess = true;
                this._pathOptions.userName = this._userPath;
                if (!this._options.sessionLocation) {
                    this._sessionName = "session";
                    this._pathOptions.sessionLocation = this._sessionName;
                    this._sessionStorage = this._injector.get(this._sessionName);
                } else {
                    this._sessionStorage = this._injector.get(this._options.sessionLocation);
                }
                if (this._options.sessionIdMethod) {
                    this._sessionIdMethod = this._options.sessionIdMethod;
                } else {
                    this._sessionIdMethod = "getId";
                }
                this._pathOptions.sessionIdMethod = this._sessionIdMethod;
            }
        }
        this._pathMaster = this._firePath(this._path, this._pathOptions);
    };


    FireEntity.prototype = {
        construct: function() {
            var self = this;
            var entity = {};

            entity.mainArray = mainArray;
            entity.mainRecord = mainRecord;

            /*fireBaseRef Mngt */
            entity.currentBase = getCurrentFirebase;
            entity.parentRef = getCurrentParentRef;
            entity.currentRef = getCurrentRef;
            entity._pathHistory = [];
            entity.pathHistory = getPathHistory;
            entity.currentPath = getCurrentPath;

            /*Queries*/
            entity.loadMainArray = loadMainArray;
            entity.loadMainRecord = loadMainRecord;

            /*Commands*/
            entity.createMainRecord = createMainRecord;
            entity.removeMainRecord = removeMainRecord;
            entity.inspect = inspect;

            if (self._geofire === true) {
                //four below should be private
                entity.createLocationRecord = createLocationRecord;
                entity.removeLocationRecord = removeLocationRecord;

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
                entity.loadUserRecord = loadUserRecord;
                entity.createUserAndMain = createUserAndMain;
                entity.createUserRecord = createUserRecord;
                entity.removeUserRecord = removeUserRecord;
                entity.loadMainFromUser = loadMainFromUser;
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

            function getCurrentPath() {
                return entity._currentPath;
            }

            function getCurrentRef() {
                return entity._currentRef;
            }

            function getCurrentParentRef() {
                return entity._currentRef.parent();
            }

            function getCurrentFirebase() {
                return entity._currentBase;
            }

            function setCurrentFirebase(base, flag) {
                entity._currentBase = base;
                if (base.ref) {
                    setCurrentRef(entity._currentBase.ref());
                }
                self._log.info("setting currentBase");
                return entity._currentBase;
            }

            function setCurrentRef(ref) {
                if (ref.ref) {
                    //catch firebaseArray queries
                    ref = ref.ref();
                } else if (ref.$ref) {
                    ref = ref.$ref();
                } else if (Array.isArray(ref)) {
                    var refs = []
                    self._q.all(ref.map(function(item) {
                            if (item.ref) {
                                refs.push(item.ref());
                            } else {
                                refs.push(item);
                            };
                        }))
                        .catch(standardError);
                    ref = refs;
                }
                entity._currentRef = ref;

                setCurrentPath(entity._currentRef);
                return entity._currentRef;
            }

            function setCurrentPath(ref) {
                var path;
                if (angular.isString(entity._currentPath)) {
                    setPathHistory(entity._currentPath);
                }
                if (ref.path) {
                    path = ref.path;
                } else if (Array.isArray(ref)) {
                    var paths = []
                    self._q.all(ref.map(function(item) {
                            if (item.path) {
                                paths.push(item.path);
                            } else {
                                paths.push(item);
                            };
                        }))
                        .catch(standardError);
                    path = paths;
                }

                entity._currentPath = path;
                return entity._currentPath;
            }

            function setPathHistory(path) {
                entity._pathHistory.push(path);
            }

            function getPathHistory() {
                return entity._pathHistory;
            }

            /******************************/


            /*******************
             * Access to firebase
             * *******************/

            function buildFire(type, path, flag) {

                return self._q.when(self._fireStarter(type, path, flag))
                    .then(setCurrentRefAndReturn)
                    .catch(standardError)

                function setCurrentRefAndReturn(res) {
                    setCurrentFirebase(res);
                    return res;
                }
            }

            /* @return{Promise(fireStarter)} returns a configured firebaseObj, firebaseArray, or a Geofire object
             */

            function fullQueryPath(args) {

                if (angular.isString(getCurrentPath())) {
                    if (getCurrentPath() === path) {
                        return getCurrentPath();
                    }
                }
            }


            function mainArray() {
                return checkCurrentRef(self._pathMaster.mainArray(), "array");
            }

            function mainRecord(id) {
                return checkCurrentRef(self._pathMaster.mainRecord(id), "object");
            }

            function nestedArray(id, name) {
                return checkCurrentRef(self._pathMaster.nestedArray(id, name), "array");
            }

            function nestedRecord(mainId, name, recId) {
                return checkCurrentRef(self._pathMaster.nestedRecord(mainId, name, recId), "object");
            }

            /* Geofire Interface */
            function mainLocations() {
                return checkCurrentRef(self._pathMaster.mainLocationsArray(), "array");
            }

            function mainLocation(id) {
                return checkCurrentRef(self._pathMaster.mainLocationsRecord(id), "object");
            }

            function geofireArray() {
                return checkCurrentRef(self._pathMaster.geofireArray(), "geo");
            }

            /* User Object Interface */
            function userNestedArray() {
                return checkCurrentRef(self._pathMaster.userNestedArray(), "array");
            }

            function userNestedRecord(id) {
                return checkCurrentRef(self._pathMaster.userNestedRecord(id), "object");
            }


            /*****************
             * Simple Methods
             * ***************/

            /*Queries*/
            function loadMainArray() {
                return mainArray()
                    .then(loadResult)
                    .then(querySuccess)
                    .catch(standardError);
            }

            function loadMainRecord(id) {
                return mainRecord(id)
                    .then(loadResult)
                    .then(querySuccess)
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

            function removeMainRecord(key) {
                return mainRecord(key)
                    .then(removeResult)
                    .then(commandSuccess)
                    .catch(standardError);
            }


            /* Geofire Interface */

            /**
             * Two Parts:
             * 1.) provides access to store and retrieve coordinates in GeoFire
             * 2.) Any addition location data(ie google place_id, reviews, etc. can be stored in a separate
             * firebase node (currently called "locations" and refered to as the mainLocations array) **/


            function geofireSet(k, c) {
                return qAll(geofireArray(), [k, c])
                    .then(completeAction)
                    .catch(standardError);

                function completeAction(res) {
                    return res[0].set(res[1][0], res[1][1]);
                }
            }

            function geofireGet(k) {
                return qAll(geofireArray(), k)
                    .then(getIn)
                    .then(querySuccess)
                    .catch(standardError);

                function getIn(res) {
                    return res[0].get(res[1]);
                }
            }

            function geofireRemove(k) {
                return qAll(geofireArray(), k)
                    .then(removeFrom)
                    .then(commandSuccess)
                    .catch(standardError);
            }


            /* save to mainLocation array
             * @param{Object}
             * @return{fireBaseRef}
             */

            //just for single records for now
            function createLocationRecord(data, geoFlag) {
                return qAll(mainLocations(), data)
                    .then(addDataAndPass)
                    .then(qAllResult)
                    .then(commandSuccess)
                    .catch(standardError);


                function addDataAndPass(res) {
                    //coords don't pass if send more than one record
                    return qAll(addTo(res), {
                        lat: res[1].lat,
                        lon: res[1].lon
                    });
                }
            }


            /* remove mainLocation record
             * @param{string} id of mainArray record
             * @return{fireBaseRef}
             */

            function removeLocationRecord(key) {

                return mainLocation(key)
                    .then(removeResult)
                    .then(commandSuccess)
                    .catch(standardError);

            }


            /* User Object Interface*/

            //TODO this needs to have option for saving as index
            //rather than firebaseArray.add()

            function loadUserRecords() {
                return userNestedArray()
                    .then(loadResult)
                    .catch(standardError);
            }

            function loadUserRecord(id) {
                return userNestedRecord(id)
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


            function removeUserRecord(key) {

                return userNestedRecord(key)
                    .then(removeResult)
                    .then(commandSuccess)
                    .catch(standardError);
            }


            /*********************************/

            /*
             * Complex Methods */


            //still needs more tests
            function createWithUserAndGeo(data, loc) {

                /* 1.) adds main array record
                 * 2.) adds user nested record,
                 * 3.) adds records to main location array for each location
                 * 4.) adds coordinates to geofire(key used is mainLocation key)
                 * 5.) updates main array record by adding nested locations array with mainLocation keys
                 */

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

            function createUserAndMain(data, geoFlag) {
                return createMainRecord(data, geoFlag, true)
                    .then(createUserRecord)
                    .catch(standardError);
            }

            function trackLocations(data, key) {
                return self._q.all(data.map(function(item) {
                        return trackLocation(item, key);
                    }))
                    .catch(standardError);
            }

            function trackLocation(data, key) {
                return createLocationRecord(addLocationKey(data, key))
                    .then(sendToGeoFireAndPassLocationResults)
                    .then(returnLocationResults)
                    .then(commandSuccess)
                    .catch(standardError);

                function sendToGeoFireAndPassLocationResults(res) {
                    return qAll(geofireSet(res[0].key(), [res[1].lat, res[1].lon]), res[0]);
                }

                function returnLocationResults(res) {
                    self._log.info('res+++');
                    self._log.info(res);
                    return res[1];
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


            /*********************************/

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
                var arrName, recName, addRec, getRec, removeRec, loadRec, loadRecs, saveRec, saveRecs, newProp;
                arrName = self._inflector.pluralize(arr);
                recName = self._inflector.singularize(arr);
                addRec = "add" + self._inflector.camelize(recName, true);
                getRec = "get" + self._inflector.camelize(recName, true);
                removeRec = "remove" + self._inflector.camelize(recName, true);
                loadRec = "load" + self._inflector.camelize(recName, true);
                loadRecs = "load" + self._inflector.camelize(arrName, true);
                saveRec = "save" + self._inflector.camelize(recName, true);
                newProp = {};


                newProp[arrName] = function(id) {
                    return nestedArray(id, arrName);
                }

                newProp[recName] = function(mainRecId, nestedRecId) {
                    return nestedRecord(mainRecId, arrName, nestedRecId);
                }

                newProp[addRec] = function(id, data) {
                    return qAll(newProp[arrName](id), data)
                        .then(addTo)
                        .then(commandSuccess)
                        .catch(standardError);
                }

                newProp[getRec] = function(mainRecId, key) {
                    return qAll(newProp[arrName](mainRecId), key)
                        .then(getRecord)
                        .then(querySuccess)
                        .catch(standardError);
                }

                newProp[removeRec] = function(mainRecId, key) {
                    return newProp[recName](mainRecId, key)
                        .then(removeResult)
                        .then(commandSuccess)
                        .catch(standardError);
                }
                newProp[loadRec] = function(id, idxOrRec) {
                    return newProp[recName](id, idxOrRec)
                        .then(loadResult)
                        .then(querySuccess)
                        .catch(standardError);
                }

                newProp[loadRecs] = function(id) {
                    return newProp[arrName](id)
                        .then(loadResult)
                        .then(querySuccess)
                        .catch(standardError);
                }

                newProp[saveRec] = function(id, idxOrRec) {
                    return qAll(newProp[arrName](id), idxOrRec)
                        .then(saveTo)
                        .then(commandSuccess)
                        .catch(standardError);
                }

                return newProp;
            }

            /*******************************/

            /* FirebaseRef Mngt
             */

            function checkCurrentRef(path, type) {
                if (angular.isObject(getCurrentRef())) {
                    self._log.info('currentRef exists');
                    return currentRefExists(path, type);
                } else {
                    self._log.info("Building new firebase");
                    //can reset counters and logger messages here
                    return buildFire(type, path, true);
                }
            }



            function currentRefExists(path, type) {
                var str;
                str = path.toString();
                if (pathEquality(str)) {
                    self._log.info("Reusing currentRef");
                    return buildFire(type, getCurrentRef(), true);
                } else if (parentEquality(str)) {
                    self._log.info("Using currentParentRef");
                    return timeWrapRef(type, getCurrentParentRef());
                } else if (isCurrentChild(str)) {
                    self._log.info("Building childRef");
                    return buildFire(type, buildChildRef(str), true);
                } else {
                    self._log.info("setting new firebase node");
                    return buildFire(type, path, true);
                }
            }


            //if new path === currentPath
            function pathEquality(path) {
                self._log.info('path arg');
                self._log.info(path);
                self._log.info('current path');
                self._log.info(getCurrentPath());
                return path === getCurrentPath();
            }

            //if new path === parent of currentRef
            function parentEquality(path) {
                self._log.info('current parent path');
                self._log.info(getCurrentParentRef().path);
                return path === getCurrentParentRef().path;
            }

            //if new path === child of currentRef
            function isCurrentChild(path) {
                var pathSub;
                pathSub = path.substring(0, getCurrentPath().length);
                self._log.info('pathSub');
                self._log.info(pathSub);
                if (path.length > getCurrentPath().length) {
                    return pathSub === getCurrentPath();
                } else {
                    return false;
                }

            }


            function buildChildRef(path) {
                var newStr = removeSlash(path.slice(getCurrentPath().length));
                return getCurrentRef().child(newStr);
            }


            /****************
             **** Helpers ****/


            /** For constructing paths*/

            //unused/untested
            function setCurrentRecord(x) {
                return getCurrentPath().substring(standardizePath(mainArrayPath()).length);
            }


            /* 
             * For processing request once
             * firebaseArray|Object is accessible*/


            /* @param{Array}[firebaseArray,data object or query params]
             *@return{Promise(firebaseRef)}
             */

            function addTo(res) {
                return res[0].add(res[1]);
            }

            function removeFrom(res) {
                return res[0].remove(res[1]);
            }

            function saveTo(res) {
                return res[0].save(res[1]);
            }


            function getRecord(res) {
							self._log.info(res[0].ref()['data']);
							self._log.info(res[1]);
                return res[0].getRecord(res[1]);
            }

            /* @param{fireBaseObject|firebaseArray}
             * @return{Promise(firebaseRef)}
             */


            function loadResult(res) {
                return res.loaded();
            }


            /* @param{fireBaseObject}
             * @return{Promise(firebaseRef)}
             */

            function removeResult(res) {
                return res.remove();
            }

            function saveResult(res) {
                return res.save();
            }

            /*******************************/

            function commandSuccess(res) {
                self._log.info('command success');
                if (Array.isArray(res) && res[0].ref) {
                    setCurrentRef(res[0]);
                } else {
                    setCurrentRef(res);
                }
                return res;
            }

            function querySuccess(res) {
                self._log.info('query success');
                self._log.info(res);
                setCurrentRef(res);
                return res;
            }


            /**misc*/

            function timeWrapRef(type, obj) {
                return self._timeout(function() {
                        return obj;
                    })
                    .then(sendRefAndBuild)
                    .catch(standardError);

                function sendRefAndBuild(res) {
                    self._log.info("notifying angular");
                    return buildFire(type, res, true);
                }
            }

            function qWrap(obj) {
                return self._q.when(obj);
            }

            function qAll(x, y) {
                return self._q.all([x, qWrap(y)]);
            }

            function qAllResult(res) {
                if (res.length) {
                    self._log.info("flattening results");
                    return flatten(res);
                } else {
                    return res;
                }
            }

            function flatten(arr) {
                var flatResults = arr.reduce(function(x, y) {
                    return x.concat(y);
                }, []);
                return flatResults;
            }

            function standardError(err) {
                return self._q.reject(err);
            }

            function removeSlash(path) {
                if (path[-1] === "/") {
                    path = path.substring(0, -1);
                }
                if (path[0] === "/") {
                    path = path.substring(1);
                }
                return path;
            }

            function stringifyPath(path) {
                if (Array.isArray(path)) {
                    path = path.join('/');
                }
                return path;
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
