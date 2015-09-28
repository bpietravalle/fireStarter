(function(angular) {
    "use strict";

    function fbObjMockService(afEntity, $timeout) {
        var DEFAULT_ID = 'REC1';

        this.stubRef = function(){
            return new MockFirebase('Mock://').child('data').child(DEFAULT_ID);
        };

        this.refWithPath = function(path) {
            var mockPath = path.join('/'); //afEntity changes array to string
            return new MockFirebase('Mock://').child(mockPath);
        };

        this.makeObject = function(initialData, ref) {
            if (!ref) {
                ref = this.stubRef();
            }
            var obj = afEntity.wrap("object", ref);
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
