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
        this._nestedArrays = false;
        this._pathMaster = this._firePath(this._path, this._firePathOptions);
        if (this._options) {
            this._firePathOptions = null || this._options.firePath;
            this._geofire = false || this._options.geofire;
            if (this._geofire === true) {
                if (this._options.locations) {
                    if (this._options.locations === true) {
                        this._locationObject = this._injector.get("location");
                    } else {
                        this._locationObject = this._injector.get(this._options.locations);
                    }
                }
                if (this._options.geofireLocation) {
                    this._geofireObject = this._injector.get(this._options.geofireLocation);
                } else {
                    this._geofireObject = this._injector.get("geo");
                }
            }
            if (this._options.nestedArrays) {
                if (!Array.isArray(this._options.nestedArrays)) {
                    throw new Error("Nested Arrays argument must be an array");
                } else {
                    this._nestedArrays = this._options.nestedArrays;
                }
            }
            this._user = this._options.user || false;
            if (this._user === true) {
                if (this._options.userLocation) {
                    this._userObject = this._injector.get(this._options.userLocation);
                } else {
                    this._userObject = this._injector.get("user");
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
                return nestedRecord(arr, id).loaded();
            }

            /*@param{Object} data to save
             *@return{Promise(firebaseRef)}
             */

            function createMainRecord(data) {
                return mainArray().add(data);
            }

            /*@param{string} id of mainRecord
             *@param{string} name of nestedArray
             *@param{Object} data to save
             *@return{Promise(firebaseRef)}
             */

            function createNestedRecord(recId, name, data) {
                return nestedArray(recId, name).add(data);
            }

            function geoFire() {
                /* save locationArray? 
                 * have nested array called locations
                 * add to geofire
                 */
            }

            function create(data) {

                return saveArrAndPassLocations(data)
                    .then(saveRecords)
                    .then(updateRequestAndGeofire)
                    .catch(standardError);

                /*@param {Object}
                 *@return{Array} [firebaseRef(request), [{location1},{location2),...]
                 */

                function saveArrAndPassLocations(data) {

                    /* first q.all */
                    return self._q.all([arraySave(data), passLocations(data)]);

                    function arraySave(data) {
                        /* first arrMngr.add */
                        return mainArray()
                            .add({
                                start: timestamp(),
                                name: data.name,
                                uid: session.getId()
                            });
                    }

                    function passLocations(data) {
                        return self._q.when(data.locations);
                    }

                }

                /*
                 * @param {Array} [firebaseRef(request), [{location1},{location2),...]
                 * @return {Array} [firebaseRef(user/request), [firebaseRef(location1), firebaseRef(location2)...], main Request key]
                 */

                function saveRecords(res) {
                    /* second q.all */
                    return self._q.all([nestedArraySave(res), addLocations(res), passMainRequestRef(res)]);
                }


                function nestedArraySave(res) {
                    var data = {
                        start: timestamp(),
                        request_id: res[0].key()
                    };
                    return self._userObject.createNestedRecord(id, self._path, data)
                        .catch(standardError);

                }


                function addLocations(res) {

                    /* third q.all */
                    return self._q.all(res[1].map(function(loc) {
                        return self._locationObject
                            .createNestedRecord(self._path, null, {
                                type: loc.type,
                                lat: loc.lat,
                                lon: loc.lon,
                                request_id: res[0].key(),
                                place_id: loc.place_id,
                                createdAt: timestamp()
                            });
                    }));

                }

                function passMainRequestRef(res) {
                    return self._q.when(res[0].key());
                }

                /*
                 * @param {Array} [firebaseRef(user/request), [firebaseRef(location1), firebaseRef(location2)...], Main request key]
                 * @return {Array} [firebaseRef(request), null(dont thing gf returns anything now]
                 */

                function updateRequestAndGeofire(res) {
                    return self._q.all([updateRequest(res), setupForGeofire(res)]);
                }

                function updateRequest(res) {
                    return self._q.all(res[1].map(function(loc) {
                        return requestLocationsArray(res[2])
                            .add({
                                location_id: loc.key(),
                                createdAt: timestamp()
                            });
                    }));

                }

                function setupForGeofire(res) {
                    return self._q.all(res[1].map(function(loc) {
                        return self._locationObject.getCoords(loc)
                            .then(geoFireSave);
                    }));

                    function geoFireSave(res) {
                        return self._geofireObject.addRequest(res.key, res.coords);
                    }
                }

            }

            function user() {
                /* 
                 *
                 */

            }

            switch (self._nestedArrays) {
                case false:
                    break;
                default:
                    return addNested(entity, self._nestedArrays);
            }

            function addNested(obj, arr) {

                return self._q.all(arr.map(function(item) {
                    var b = addNestedArray(obj, item);
                    self._log.info(b);
                }));

            }

            function addNestedArray(obj, arr) {
                var arrName = self._inflector.pluralize(arr);
                var recName = self._inflector.singularize(arr);
                var newProp = {};

                newProp[arrName] = function(id) {
                    return self._pathMaster.nestedArray(id, arrName);
                }

                newProp[recName] = function(mainRecId, nestedRecId) {
                    return self._fireStarter("object", self._pathMaster.nestedRecord(mainRecId, arrName, nestedRecId));
                    // return self._pathMaster.nestedArray(id, arrName);
                }


                return angular.extend(obj, newProp);
            }


            self._entity = entity;
            return self._entity;
        }
    };
}.call(this));
