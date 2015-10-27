(function() {
    "use strict";
    var FirePath;

    angular.module("fireStarter.services")
        .factory("firePath", firePathFactory);

    /** @ngInject */
    function firePathFactory($rootScope, $q, $log, $injector) {

        return function(path, options) {
            var fb = new FirePath($rootScope, $q, $log, $injector, path, options);
            return fb.construct();

        };

    }

    FirePath = function($rootScope, $q, $log, $injector, path, options) {
        this._rootScope = $rootScope;
        this._q = $q;
        this._log = $log;
        this._injector = $injector;
        this._path = path;
        this._options = options;
    };


    FirePath.prototype = {
        construct: function() {
            var self = this;
            var fire = {};

            fire.mainArray = mainArray;
            fire.mainRecord = mainRecord;
            fire.nestedArray = nestedArray;
            fire.nestedRecord = nestedRecord;
            fire.makeNested = makeNested; //make private?

						//TODO need to check for nested arrays and flatten;
            function mainArray() {
                return checkParam(self._path);
            }

            function mainRecord(id) {
                return extendPath(mainArray(), id);
            }

            function nestedArray(recId, name) {
                return extendPath(mainRecord(recId), name);
            }

            function nestedRecord(mainRecId, arrName, recId) {
                return extendPath(nestedArray(mainRecId, arrName), recId);
            }

            function makeNested(parent, child) {
                return extendPath(checkParam(parent), child);
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
