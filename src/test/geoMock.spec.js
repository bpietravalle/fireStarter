(function() {
    "use strict";

    describe("GeoMngr Service", function() {
        var geo, geoExample, geoMock, feederGPS, location, radius, $rootScope, $q, gfPath, gfSpy, gfName, deferred, $provide, mockObj, ref, obj, data, geoMngr, fbRef, key, field, coords, $geofire;

        key = "a_string";
        radius = 0.1;
        data = {
            center: coords,
            radius: radius
        };
        beforeEach(function() {
            module("fbMocks");
            module("fb.services");
            inject(function(_geoMngr_, _$q_, _$rootScope_, _geoMock_, _fbRef_, _$geofire_) {
                $rootScope = _$rootScope_;
                fbRef = _fbRef_;
                geoMock = _geoMock_;
                $geofire = _$geofire_;
                geoMngr = _geoMngr_;
                $q = _$q_;
            });
            key = "a_key";
            gfName = "feeders";
            gfPath = ["geofield"];
        });

        afterEach(function() {
            geo = null;
        });

        it("test geoMock", function() {
            var test = geoMock.make("feeders", ["feeder", "path"]);
            expect(test).toEqual("asdf");
            expect(test.ref()).toEqual("asdf");

        });


    });


})();
