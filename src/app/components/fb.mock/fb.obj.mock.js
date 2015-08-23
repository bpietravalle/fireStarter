(function(angular) {
    "use strict";

    function fbObjMockService(afEntity, $timeout) {
        var DEFAULT_ID = 'REC1';
        // var FIXTURE_DATA = {
        //     aString: 'alpha',
        //     aNumber: 1,
        //     aBoolean: false,
        //     anObject: {
        //         bString: 'bravo'
        //     }
        // };

        this.stubRef = function(){
            return new MockFirebase('Mock://').child('data').child(DEFAULT_ID);
        };

        this.makeObject = function(initialData, ref) {
            if (!ref) {
                ref = this.stubRef();
            }
            var obj = afEntity.set("object", ref);
            if (angular.isDefined(initialData)) {
                ref.ref().set(initialData);
                ref.flush();
                $timeout.flush();
            }
            return obj;
        };
    }
    fbObjMockService.$inject = ['afEntity','$timeout'];
    angular.module('fbMocks')
        .service('mockObj', fbObjMockService);

})(angular);
