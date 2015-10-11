(function() {
    "use strict";

    describe("GeoMock", function() {
        var geo, test, geoExample, test1, $geofire, geoMock, feederGPS, location, radius, $rootScope, $q, gfPath, gfSpy, gfName, deferred, $provide, obj, data, fbRef, key, field, coords;

        key = "a_string";
        radius = 0.1;
						coords = [90,150];
        data = {
            center: coords,
            radius: radius
        };
        beforeEach(function() {
            module("fbMocks");
            inject(function(_$q_, _$rootScope_, _$geofire_, _geoMock_) {
                $rootScope = _$rootScope_;
								$geofire = _$geofire_;
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
            test1 = null;
        });

        it("mock constructor", function() {
            expect(test).toBeDefined();
        });
        it("geoQuerySpy should be defined", function() {
            expect(geoMock.geoQuerySpy).toBeDefined();
        });
        it("geoQueryRegSpy should be defined", function() {
            expect(geoMock.geoQueryRegSpy).toBeDefined();
        });
        it("refSpy should be defined", function() {
            expect(geoMock.refSpy).toBeDefined();
        });
        describe("GeoMock functions", function() {

            var definedfns = ["path", "ref",
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

        describe("geoSpyObj", function() {
            it("should be defined", function() {
                expect(geoMock.geoSpyObj).toBeDefined();
            });
            it("should have a query() method", function() {
                expect(geoMock.geoSpyObj.query()).toBeDefined();
            });
            it("should have a ref() method", function() {
                expect(geoMock.geoSpyObj.ref()).toBeDefined();
            });
            it("query() should = geoQuerySpy", function() {
                expect(geoMock.geoSpyObj.query()).toEqual(geoMock.geoQuerySpy);
            });
            it("ref() should = refSpy", function() {
                expect(geoMock.geoSpyObj.ref()).toEqual(geoMock.stubRef());
            });
            it("get() should be defined()", function() {
                expect(geoMock.geoSpyObj.get()).toBeDefined();
            });
            it("set() should be defined()", function() {
                expect(geoMock.geoSpyObj.set()).toBeDefined();
            });
            it("remove() should be defined()", function() {
                expect(geoMock.geoSpyObj.remove()).toBeDefined();
            });

        });
        describe("GeoSpy", function() {
            it("should be defined", function() {
                expect(geoMock.geoSpy).toBeDefined();
            });
            it("should be a promise", function() {
                expect(geoMock.geoSpy).toBeAPromise();
            });
            describe("After resolving the promise", function() {
                beforeEach(function() {
                    spyOn($q, "when").and.callThrough();
                    geoMock.geoSpy.then(function(res) {
                        test = res;
                        return test;
                    });
                    $rootScope.$digest();
                });
                it("query() should return a geoQuerySpyOby", function() {
                    expect(test.query()).toEqual(geoMock.geoQuerySpy);
								});
								it("ref() should return a refSpy", function(){
                    expect(test.ref()).toEqual(geoMock.stubRef());
                });
								it("get() should be defined", function(){
									expect(test.get()).toBeDefined();
								});
								it("set() should be defined", function(){
									expect(test.set()).toBeDefined();
								});
								it("remove() should be defined", function(){
									expect(test.remove()).toBeDefined();
								});
            });

        });
				describe("Queries for realzies", function(){
					beforeEach(function(){
						geoMock.gfURL.set(geoMock.initialData);
						geoMock.gfURL.flush();
						test1 = $geofire(geoMock.gfURL);
						$rootScope.$digest();
					});
					it("should work", function(){
						var t = test1.$query(data).on("key_entered","SEARCH:KEY_ENTERED")
						expect(t).toEqual("asdf");
					});
				 

				});

    });

})();
