(function() {
    "use strict";
    var FirePath;

    angular.module("fireStarter.services")
        .factory("firePath", firePathFactory);

    /** @ngInject */
    function firePathFactory(utils, $window, $q, $log, $injector, FBURL) {

        return function(path, options, fuel) {
            var fb = new FirePath(utils, $window, $q, $log, $injector, path, options, fuel, FBURL);
            return fb.construct();

        };

    }

    FirePath = function(utils, $window, $q, $log, $injector, path, options, fuel, FBURL) {
        this._utils = utils;
        this._window = $window;
        this._FBURL = FBURL;
        this._q = $q;
        this._log = $log;
        this._injector = $injector;
        this._path = path;
        this._fuel = fuel || null;
        this._options = options || null;
        if (!this._FBURL) {
            if (this._options.root) {
                this._rootPath = this._injector.get(this._options.root);
            } else {
                throw new Error("You must provide a root path, either by a constant 'FBURL' or by providing a service name to inject");
            }
        } else {
            this._rootPath = this._FBURL;
        }
        this._sessionAccess = false;
        this._geofire = false;
        if (this._options) {
            if (this._options.sessionAccess === true) {
                this._sessionAccess = true;
                if (this._options.sessionLocation) {
                    this._sessionStorage = this._injector.get(this._options.sessionLocation);
                } else {
                    throw new Error("You must provide a service to inject to access your session");
                }
                if (this._options.sessionIdMethod) {
                    this._sessionIdMethod = this._options.sessionIdMethod;
                } else {
                    throw new Error("You must provide a method to query the sessionId");
                }
                if (this._options.userName) {
                    this._userName = this._options.userName;
                } else {
                    this._userName = "users";
                }
            }
            if (this._options.geofire === true) {
                this._geofire = true;
                this._locationName = this._options.locationName;
                this._geofireName = this._options.geofireName;
            }
        }
    };


    FirePath.prototype = {
        construct: function() {
            var self = this;
            var fire = {};

            fire.rootRef = root;
            fire.mainArray = mainArray;
            fire.mainRecord = mainRecord;
            fire.nestedArray = nestedArray;
            fire.nestedRecord = nestedRecord;
            fire.makeNestedRef = makeNestedRef; //make private?
            fire.currentNode = currentNode;
            fire.currentParentNode = currentParentNode;
            fire.currentRecord = currentRecord;
            fire.currentNestedArray = currentNestedArray;
            fire.currentNestedRecord = currentNestedRecord;
            fire.nodeIdx = nodeIdx;
            fire.inspect = inspect;
            fire.checkPathParams = checkPathParams;
            fire._pathHistory = [];
            fire.currentRef = getCurrentRef;
            fire.currentPath = getCurrentPath;
            fire.currentParentRef = getCurrentParentRef;
            fire.currentParentPath = getCurrentParentPath;
            fire.pathHistory = getPathHistory;
            fire.currentDepth = currentDepth;

            if (self._sessionAccess === true) {
                fire.userNestedArray = userNestedArray;
                fire.userNestedRecord = userNestedRecord;
            }
            if (self._geofire = true) {
                fire.geofireArray = geofireArray;
                fire.geofireRecord = geofireRecord;
                fire.mainLocationsArray = mainLocationsArray;
                fire.mainLocationsRecord = mainLocationsRecord;
            }

            /*************** firebaseRefs ************/


            function root() {
                return new self._window.Firebase(rootPath());
            }

            function setChild(path) {
                return root().child(stringify(path));
            }

            function mainArray() {
                return setChild(mainArrayPath());
            }

            function mainRecord(id) {
                return setChild(mainRecordPath(id));
            }

            function nestedArray(recId, name) {
                return setChild(nestedArrayPath(recId, name));
            }

            function nestedRecord(mainRecId, arrName, recId) {
                return setChild(nestedRecordPath(mainRecId, arrName, recId));
            }

            function makeNestedRef(parent, child) {
                return setChild(makeNestedPath(parent, child));
            }

            /* User Object refs */
            function userNestedArray() {
                return setChild(userNestedArrayPath());
            }

            function userNestedRecord(id) {
                return setChild(userNestedRecordPath(id));
            }

            /* Geofire refs */
            function geofireArray() {
                return setChild(geofireArrayPath());
            }

            function geofireRecord(id) {
                return setChild(geofireRecordPath(id));
            }

            /* Main Location Array refs */
            function mainLocationsArray() {
                return setChild(mainLocationArrayPath());
            }

            function mainLocationsRecord(id) {
                return setChild(mainLocationRecordPath(id));
            }

            /******* Paths ******************/

            function rootPath() {
                return removeSlash(self._rootPath);
            }

            function mainArrayPath() {
                return arrayify(self._path);
            }

            function mainRecordPath(id) {
                return extendPath(mainArrayPath(), id);
            }

            function nestedArrayPath(recId, name) {
                return extendPath(mainRecordPath(recId), name);
            }

            function nestedRecordPath(mainRecId, arrName, recId) {
                return extendPath(nestedArrayPath(mainRecId, arrName), recId);
            }

            function makeNestedPath(parent, child) {
                return extendPath(mainArrayPath(), extendPath(arrayify(parent), child));
            }

            function userNestedArrayPath() {
                return arrayify([self._userName, sessionId(), self._path]);
            }

            function userNestedRecordPath(id) {
                return extendPath([self._userName, sessionId(), self._path], id);
            }

            function geofireArrayPath() {
                return arrayify([self._geofireName, self._path]);
            }

            function geofireRecordPath(id) {
                return extendPath([self._geofireName, self._path], id);
            }

            function mainLocationArrayPath() {
                return arrayify([self._locationName, self._path]);
            }

            function mainLocationRecordPath(id) {
                return extendPath([self._locationName, self._path], id);
            }

            function sessionId() {
                return self._sessionStorage[self._sessionIdMethod]();
            }

            function currentParentNode(path) {
                return relativePathArray(path)[relativePathArray(path).length - 2];
            }

            function currentDepth(path) {
                return relativePathArray(path).length;
            }

            function currentNestedArray(path) {
                return relativePathArray(path)[2];
            }

            function currentNestedRecord(path) {
                return relativePathArray(path)[3];
            }

            function currentNode(path) {
                return relativePathArray(path)[relativePathArray(path).length - 1];
            }

            function pathLength(path) {
                return fullPath(path).length;
            }

            function currentRecord(path) {
                return relativePathArray(path)[1];
            }

            function relativePath(path) {
                return fullPath(path).slice(pathLength(rootPath()));
            }

            function relativePathArray(str) {
                if (str.search(rootPath()) < 0) {
                    throw new Error("you must pass an absolute path");
                } else {
                    return str.slice(rootPath().length).split('/');
                }
            }

            /*@param{string} absolute path
             */

            function checkPathParams(path) {
                var str = fullPath(path);
                switch (getCurrentRef()) {
                    case false:
                        self._log.info("setting new firebase node");
                        setCurrentRef(relativePath(path));
                        break;
                    case true:
                        switch (str) {
                            case pathEquality(str):
                                self._log.info("Reusing currentRef");
                                getCurrentRef();
                                break;
                            case parentEquality(str):
                                self._log.info("Using currentParentRef");
                                getCurrentParentRef();
                                break;
                            case isCurrentChild(str):
                                self._log.info("Building childRef");
                                setCurrentRef(buildChildRef(str));
                                break;
                            default:
                                self._log.info("setting new firebase node");
                                setCurrentRef(relativePath(path));
                                break;
                        }
                }

                return setChild(getCurrentRef());
            }

            /**current path
             *nod
             */

            function nodeIdx(path, str) {
                return relativePathArray(path).indexOf(str);
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

            function isCurrentChild(path) {
                var pathSub;
                pathSub = path.substring(0, getCurrentPath().length);
                if (path.length > getCurrentPath().length) {
                    return pathSub === getCurrentPath();
                } else {
                    return false;
                }
            }

            function buildChildRef(path) {
                return getCurrentRef().child(path.slice(getCurrentPath()));
            }

            function getCurrentPath() {
                return fire._currentRef.path;
            }

            function getCurrentRef() {
                return fire._currentRef;
            }

            function getCurrentParentRef() {
                return fire._currentRef.parent();
            }

            function getCurrentParentPath() {
                return getCurrentParentRef().path;
            }


            function setCurrentRef(ref) {
                var path;

                return checkArray()
                    .then(checkRefAndSet)
                    .catch(standardError);

                function checkArray(ref) {

                    if (Array.isArray(ref)) {
                        return self._q.wrap(ref[0].ref())
                            .catch(function() {
                                self._q.reject(("firebaseRef must be first item in the array"));
                            });
                    } else {
                        return self._q.when(ref);
                    }
                }

                function checkRefAndSet(res) {
                    return self._q.when(res.path)
                        .then(setPathAndRef)
                        .catch(function() {
                            self._q.reject(("argument is not a firebaseRef"));
                        });

                    function setPathAndRef(path) {
                        fire._currentRef = res;
                        setCurrentPath(path);
                        return fire._currentRef;
                    }
                }
            }

            function setCurrentPath(ref) {
                var path;
                if (angular.isString(fire._currentPath)) {
                    setPathHistory(fire._currentPath);
                }
                fire._currentPath = path;
                return fire._currentPath;
            }

            function setPathHistory(path) {
                fire._pathHistory.push(path);
            }

            function getPathHistory() {
                return fire._pathHistory;
            }

            function extendPath(arr, id) {
                return self._utils.extendPath(arr, id);
            }

            function arrayify(param) {
                return self._utils.arrayify(param);
            }

            function stringify(arr) {
                return self._utils.stringify(arr);
            }

            function fullPath(path) {
                return rootPath() + stringify(arrayify(removeSlash(path)));
            }

            function removeSlash(path) {
                return self._utils.removeSlash(path);
            }

            function flatten(arr) {
                return self._utils.flatten(arr);
            }

            function inspect() {
                return self;
            }

            self._fire = fire;
            return self._fire;
        }
    };

}.call(this));
