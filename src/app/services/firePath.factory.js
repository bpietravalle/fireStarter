(function() {
    "use strict";
    var FirePath;

    angular.module("fireStarter.services")
        .factory("firePath", firePathFactory);

    /** @ngInject */
    function firePathFactory($window, $q, $log, $injector, FBURL) {

        return function(path, options) {
            var fb = new FirePath($window, $q, $log, $injector, path, options, FBURL);
            return fb.construct();

        };

    }

    FirePath = function($window, $q, $log, $injector, path, options, FBURL) {
        this._window = $window;
        this._FBURL = FBURL;
        this._q = $q;
        this._log = $log;
        this._injector = $injector;
        this._path = path;
        this._options = options;
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

            function root() {
                return new self._window.Firebase(self._rootPath);
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



            /*******************************/

            function mainArrayPath() {
                return checkParam(self._path);
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
                return extendPath(mainArrayPath(), extendPath(checkParam(parent), child));
            }

            function userNestedArrayPath() {
                return checkParam([self._userName, sessionId(), self._path]);
            }

            function userNestedRecordPath(id) {
                return extendPath([self._userName, sessionId(), self._path], id);
            }


            function geofireArrayPath() {
                return checkParam([self._geofireName, self._path]);
            }

            function geofireRecordPath(id) {
                return extendPath([self._geofireName, self._path], id);
            }

            function mainLocationArrayPath() {
                return checkParam([self._locationName, self._path]);
            }

            function mainLocationRecordPath(id) {
                return extendPath([self._locationName, self._path], id);
            }

            function sessionId() {
                return self._sessionStorage[self._sessionIdMethod]();
            }

            function extendPath(arr, id) {
                arr.push(id);
                return flatten(arr);
            }

            function checkParam(param) {
                if (Array.isArray(param)) {
                    return flatten(param);
                } else {
                    return extendPath([], param);
                }
            }

            function stringify(arr) {
                if (Array.isArray(arr)) {
                    arr = arr.join('/');
                }
                return arr;
            }

            function flatten(arr) {
                var flatResults = arr.reduce(function(x, y) {
                    return x.concat(y);
                }, []);
                return flatResults;
            }

            self._fire = fire;
            return self._fire;
        }
    };

}.call(this));
