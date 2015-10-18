(function() {
    "use strict";


    /** @ngInject */
    function fbHelperService($q, $log) {

        var utils = {

            getNestedKey: getNestedKey,
            timestamp: timestamp
        };

        return utils;

        //TODO: if property doesn't exist than separate key/value pair and try to save separately

        function updateRecord(path, data) {
            return setupForUpdate()
                .then(iterateOverData)
                .then(iterateSuccess)
                .catch(standardError);


            function setupForUpdate() {
                return $q.all([buildKeys(data)])

            }

            function buildKeys(res) {
                var obj = {
                    keys: findKeys(res),
                    data: res
                }
                return $q.when(obj);
            }

            //TODO: change it back to how fn appears in arrMngr
            function iterateOverData(res) {
                var obj, str, keys, dataSet;

                keys = res[1].keys;
                dataSet = res[1].data;
                obj = res[0];

                return $q.all(keys.map(function(key) {
                        str = key.toString();
                        obj[str] = dataSet[str];
                    }))
                    .then(returnObj);

                function returnObj(res) {
                    return obj;
                }
            }

            function iterateSuccess(res) {
                return obj.save(res);

            }
        }

        function findKeys(obj) {
            if (Object.keys) {
                return Object.keys(obj)
            } else {
                return setKeys(obj);
            }
        }

        function setKeys(o) {
            //TODO test code below for older browsers; from coderwall.com
            if (o !== Object(o)) {
                throw new TypeError('Object.keys called on a non-object');
                var k = [],
                    p;
                for (p in o)
                    if (Object.prototype.hasOwnProperty.call(o, p)) k.push(p);
                return k;
            }
        }

        /*FROM ArrMngr 
         */


        /* To keep the data structure flat, you need to store data in multiple places,
         * this helps me to quikcly access the nested primary key if:
         * I have the objects value and primarykey in the original node
         * @param {string}...the known key of the nested obj
         * @param {string}..the column name that stores the foreignKey of the nested obj.
         * @param {Array of strings or stringable items}...path to nested array
         * @return {string}...primaryKey of nested obj
         */

        function getNestedKey(val, col, path) {
            //TODO: add constrain so only iterate over recent/active, etc items
            return arr.build(path)
                .then(iterateOverColumns)
                .then(checkArray)
                .catch(standardError);


            function iterateOverColumns(res) {
                var nestedKey = null;
                $q.all(res.map(function(item) {
                    if (item[col] === val) {
                        nestedKey = item.$id;
                    }
                }));
                return nestedKey;
            }

            function checkArray(res) {
                if (res !== null) {
                    return res;
                } else {
                    throw new Error("Foreign key: " + col + " with a value of: " + val + " was not found.");
                }

            }
        }

        /* @param {$firebaseArray}...
         * @param {String}..recid.
         * @param {Object}..js object where key = property id, value = updated value
         * @return {Promise(Ref)}...Promise with record's firebase ref
         */

        function updateRecord(path, id, data) {
            if (angular.isDefined(data)) {
                return updateRecordWithDataObj(path, id, data);
            } else {
                return arr.save(path, id); //$fbArray, $fbObject
            }
        }

        function updateRecordWithDataObj(path, id, data) {
            /* this does not work unless get record within the fn */
            return $q.when(id)
                .then(iterateOverData)
                .then(iterateSuccess)
                .catch(standardError);


            //TODO: if property doesn't exist than separate key/value pair and try to save new property separately
            function iterateOverData(res) {
                var key, str, keys;
                keys = Object.keys(data);

                $q.all(keys.map(function(key) {
                    str = key.toString();
                    res[str] = data[str];
                }));
                return res;
            }


            function iterateSuccess(res) {
                return arr.save(path, res);

            }
        }

        function updateNestedArray(val, col, path, data) {
            return arr.getNestedKey(val, col, path)
                .then(getKeySuccess)
                .catch(standardError);

            function getKeySuccess(res) {
                return arr.updateRecord(path, res, data);
            }
        }





        /* Helper functions
         */
        function standardError(err) {
            return $q.reject(err);
        }

        //TODO: add test
        function timestamp() {
            return Firebase.ServerValue.TIMESTAMP;
        }
    }

    angular.module("fireStarter.services")
        .service("fbHelper", fbHelperService);
})();
