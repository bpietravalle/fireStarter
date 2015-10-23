(function() {
    "use strict";
    var FirePath;

    angular.module("fireStarter.services")
        .factory("firePath", firePathFactory);

    /** @ngInject */
    function firePathFactory($rootScope, $q, $log) {

        return function(path, options) {
            var fb = new FirePath($rootScope, $q, $log, path, options);
            return fb.construct();

        };

    }

    FirePath = function($rootScope, $q, $log, path, options) {
        this._rootScope = $rootScope;
        this._q = $q;
        this._log = $log;
        this._path = path;
        this._options = options;
        if (this._options) {
            this._sessionAccess = this._options.sessionAccess || false;
        }
        if (this._sessionAccess === true) {
            this._sessionStorage = this._options.sessionLocation || this._rootScope.session;
            this._sessionIdMethod = this._options.sessionIdMethod || "getId";
        }
    };


    FirePath.prototype = {
        construct: function() {
            var self = this;
            var fire = {};

            fire.mainArray = mainArray;
            fire.mainRecord = mainRecord;
            fire.nestedArray = nestedArray;
            fire.nestedRecord = nestedRecord;
            fire.makeNested = makeNested;
            if (self._sessionAccess === true) {
                fire.currentUser = currentUser;
                fire.session = session;
                fire.sessionId = sessionId;
            }

            function mainArray() {
                return checkParam(self._path);
            }

            function currentUser() {
                return "go to your session and get the id";
            }

						//would prefer to remove this
            function session() {
                return self._sessionStorage;
            }

            function sessionId() {
                return self._sessionStorage[self._sessionIdMethod]();
            }

            function mainRecord(id) {
                return extendPath(mainArray(), id);
            }

            function nestedArray(recId, name) {
                return extendPath(mainRecord(recId), name);
            }

						//remove
            function nestedRecord(arrId, name, recId) {
                return extendPath(nestedArray(arrId, name), recId);
            }

            function makeNested(parent, child) {
                parent = checkParam(parent);
                parent.push(child);
                return parent;
            }

            function extendPath(arr, id) {
                arr.push(id);
                return arr;
            }

            function checkParam(param) {
                if (Array.isArray(param)) {
                    return param;
                } else {
                    return extendPath([], param);
                }
            }

            self._fire = fire;
            return self._fire;
        }
    };

}.call(this));
