(function() {
    "use strict";

    describe("GeoMocks", function() {
        var geo, test, geoExample, test1, fsMocks, feederGPS, location, radius, $rootScope, $q, gfPath, gfSpy, gfName, deferred, $provide, obj, data, fbRef, key, field, coords;

        key = "a_string";
        radius = 0.1;
        coords = [90, 150];
        data = {
            center: coords,
            radius: radius
        };
        beforeEach(function() {
            module("fbMocks");
            inject(function(_$q_, _$rootScope_, _fsMocks_) {
                $rootScope = _$rootScope_;
                fsMocks = _fsMocks_;
                $q = _$q_;
            });
            key = "a_key";
            gfName = "feeders";
            gfPath = ["geofield"];
            test = fsMocks.makeGeo(fsMocks.geoData);
        });

        afterEach(function() {
            test = null;
            test1 = null;
        });

        describe("constructor", function() {
            it("with data and without path hould be defined", function() {
                expect(test).toBeDefined();
            });
            it("without data should be defined", function() {
                test = fsMocks.makeGeo();
                expect(test).toBeDefined();
            });
            it("without data but with ref should work", function() {
                var ref = fsMocks.stubRef();
                test = fsMocks.makeGeo(null, ref, true);
                expect(test).toBeDefined();
            });
        });

        // it("geoQuerySpy should be defined", function() {
        //     expect(fsMocks.geoQuerySpy).toBeDefined();
        // });
        // it("geoQueryRegSpy should be defined", function() {
        //     expect(fsMocks.geoQueryRegSpy).toBeDefined();
        // });
        // it("refSpy should be defined", function() {
        //     expect(fsMocks.refSpy).toBeDefined();
        // });
        describe("Geofire functions", function() {
            var definedfns = ["path", "ref",
                "get", "distance", "query", "remove", "set"
            ];
            var promisefns = ["get", "set", "remove"];

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

        describe("geoSpyObj", function() {
            it("should be defined", function() {
                expect(fsMocks.geoSpyObj).toBeDefined();
            });
            it("should have a query() method", function() {
                expect(fsMocks.geoSpyObj.query()).toBeDefined();
            });
            it("should have a ref() method", function() {
                expect(fsMocks.geoSpyObj.ref()).toBeDefined();
            });
            it("query() should = geoQuerySpy", function() {
                expect(fsMocks.geoSpyObj.query()).toEqual(fsMocks.geoQuerySpy);
            });
            it("ref() should = refSpy", function() {
                expect(fsMocks.geoSpyObj.ref()).toEqual(fsMocks.stubRef());
            });
            it("get() should be defined()", function() {
                expect(fsMocks.geoSpyObj.get()).toBeDefined();
            });
            it("set() should be defined()", function() {
                expect(fsMocks.geoSpyObj.set()).toBeDefined();
            });
            it("remove() should be defined()", function() {
                expect(fsMocks.geoSpyObj.remove()).toBeDefined();
            });
        });
        describe("geoQuerySpy", function() {
            it("should be defined", function() {
                expect(fsMocks.geoQuerySpy).toBeDefined();
            });
            it("updateCriteria() should be defined()", function() {
                expect(fsMocks.geoQuerySpy.updateCriteria).toBeDefined();
            });
            it("on() should be defined()", function() {
                expect(fsMocks.geoQuerySpy.on).toBeDefined();
            });
            it("remove() should be defined()", function() {
                expect(fsMocks.geoQuerySpy.remove).toBeDefined();
            });
            it("center() should be defined()", function() {
                expect(fsMocks.geoQuerySpy.center).toBeDefined();
            });
            it("radius() should be defined()", function() {
                expect(fsMocks.geoQuerySpy.radius).toBeDefined();
            });
            it("cancel() should be defined()", function() {
                expect(fsMocks.geoQuerySpy.cancel).toBeDefined();
            });
        });

    });

})();
