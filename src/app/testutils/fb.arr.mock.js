(function(angular) {
    "use strict";

    function fbArrMockService(afEntity, $timeout, $firebaseArray) {

        this.stubRef = function() {
            return new MockFirebase('Mock://').child('data/REC1');
        };
        this.stubArray = function(initialData, ref) {
            if (!ref) {
                ref = this.stubRef();
            }
            var arr = afEntity.wrap("array", ref);
            if (initialData) {
                ref.set(initialData);
                ref.flush();
                this.flushAll();
            }
            return arr;
        };
        this.refWithPath = function(path) {
            var mockPath = path.join('/'); //afEntity changes array to string
            return new MockFirebase('Mock://').child(mockPath);
        };


				this.mockRecord = function(arr, id){
					return arr.$getRecord(id);
				};
        this.nestedMock = function(initialData, path) {
            var ref = new MockFirebase('Mock://').child(path);
            var arr = afEntity.set("array", ref);
            if (initialData) {
                ref.set(initialData);
                ref.flush();
                this.flushAll();
            }
            return arr;
        }

        this.extendArray = function(initialData, Factory, ref) {
            if (!Factory) {
                Factory = $firebaseArray;
            }
            if (!ref) {
                ref = this.stubRef();
            }
            var arr = new Factory(ref);
            if (initialData) {
                ref.set(initialData);
                ref.flush();
                this.flushAll();
            }
            return arr;
        };

        this.flushAll = (function() {
            return function flushAll() {
                Array.prototype.slice.call(arguments, 0).forEach(function(o) {
                    o.flush();
                });
                try {
                    $timeout.flush();
                } catch (e) {}
            };
        })();

        this.recArrayData = {
            "1": {
                number: "202-202-1111",
                type: "cell"
            },
            "2": {
                number: "603-202-5555",
                type: "fax"
            }
        };

    }

    fbArrMockService.$inject = ['afEntity', '$timeout', '$firebaseArray'];
    angular.module('fbMocks')
        .service('mockArr', fbArrMockService);

})(angular);
