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
            var arr = afEntity.set("array", ref);
            if (initialData) {
                ref.set(initialData);
                ref.flush();
                this.flushAll();
            }
            return arr;
        };

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

    }

    fbArrMockService.$inject = ['afEntity', '$timeout', '$firebaseArray'];
    angular.module('fbMocks')
        .service('mockArr', fbArrMockService);

})(angular);
