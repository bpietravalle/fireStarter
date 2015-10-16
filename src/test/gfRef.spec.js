(function() {
    "use strict";

    describe("GeoMock", function() {
        var geo, test, geoExample, test1, geoMock, feederGPS, location, radius, $rootScope, $q, gfRef, gfPath, gfSpy, gfName, deferred, $provide, obj, data, fbRef, key, field, coords;

        key = "a_string";
        radius = 0.1;
        coords = [90, 150];
        data = {
            center: coords,
            radius: radius
        };
        beforeEach(function() {
            module("fbMocks");
            inject(function(_$q_, _$rootScope_, _geoMock_, _gfRef_) {
                gfRef = _gfRef_;
                $rootScope = _$rootScope_;
                geoMock = _geoMock_;
                $q = _$q_;
            });
            key = "a_key";
            gfName = "feeders";
            gfPath = ["geofield"];
						test = gfRef(gfPath);
        });

        afterEach(function() {
            test = null;
            test1 = null;
        });

        it("should be defined", function() {
            expect(test).toBeDefined();
        });
        it("set should be defined", function() {
            expect(test.set(key,coords)).toBeDefined();
        });
        it("get should be defined", function() {
            expect(test.get(key)).toBeDefined();
        });
        it("query should be defined", function() {
            expect(test.query(data)).toBeDefined();
        });


    });

})();
