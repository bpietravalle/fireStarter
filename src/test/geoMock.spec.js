(function() {
    "use strict";

    describe("GeoMock", function() {
        var geo, test, geoExample, geoMock, feederGPS, location, radius, $rootScope, $q, gfPath, gfSpy, gfName, deferred, $provide, obj, data, fbRef, key, field, coords;

        key = "a_string";
        radius = 0.1;
        data = {
            center: coords,
            radius: radius
        };
        beforeEach(function() {
            module("fbMocks");
            inject(function(_$q_, _$rootScope_, _geoMock_) {
                $rootScope = _$rootScope_;
                geoMock = _geoMock_;
                $q = _$q_;
            });
            key = "a_key";
            gfName = "feeders";
            gfPath = ["geofield"];
            test = geoMock.make(["feeder", "path"]);
        });

        afterEach(function() {
            test = null;
        });

        it("mock constructor", function() {
            expect(test).toBeDefined();
        });
        describe("GeoMock functions", function() {

            var definedfns = [ "path", "ref",
                "get", "distance", "query", "remove", "set"
            ];

            var promisefns = ["get", "set",
                "distance", "query", "remove"
            ];

            function testPromise(y) {
                it("the " + y + " function should return a promise", function() {
                    expect(test[y]()).toBeAPromise();
                });
            }

            function testDefined(y) {
                it("the " + y + " function should be defined", function() {
                    expect(test[y]).toBeDefined();
                });
            }

            promisefns.forEach(testPromise);
            definedfns.forEach(testDefined);


        });
        // TODO add more tests for return values and testing getting/setting, etc
        // describe("After Calling Instance", function(){
        // 	beforeEach(function(){
        // 		test.instance();
        // 		$rootScope.$digest();
        // 	});
        // 	it("should still be able to call ref, name, and path", function(){


        // 	});


    });


})();
