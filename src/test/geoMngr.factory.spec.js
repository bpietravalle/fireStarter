(function() {
    "use strict";

    describe("GeoMngr Service", function() {
        var geo, base, fireStarter, spy, angular, STUB_DATA, $timeout, result, $log, failure, successSpy, failureSpy, NEW_DATA, geo, geoMock, location, radius, $rootScope, $q, gfPath, gfSpy, gfName, deferred, $provide, mockObj, ref, obj, data, geoMngr, geoRef, key, field, coords;

        STUB_DATA = {
            "a": {
                "g": "keyA",
                "1": {
                    "0": 90,
                    "1": 50
                }
            },
            "b": {
                "g": "keyB",
                "1": {
                    "0": 30,
                    "1": 60
                }
            },
            "c": {
                "g": "keyC",
                "1": {
                    "0": -70,
                    "1": 150
                }
            }
        };
        NEW_DATA = {
            "d": {
                "g": "keyD",
                "1": {
                    "0": 20,
                    "1": -180
                }
            },
            "e": {
                "g": "keyE",
                "1": {
                    "0": 40,
                    "1": -100
                }
            }
        };


        location = {
            a: [90, 150],
            b: [50, 100]
        };
        key = "a_string";
        coords = location.a;
        radius = 0.1;
        data = {
            center: coords,
            radius: radius
        };
        beforeEach(function() {
            module("fbMocks");
            module("fireStarter.services");
            inject(function(_fireStarter_, _$q_, _$timeout_, _$log_, _$rootScope_) {
                $rootScope = _$rootScope_;
                fireStarter = _fireStarter_;
                $timeout = _$timeout_;
                $log = _$log_;
                $q = _$q_;
            });
            key = "a_key";
            gfPath = ["geofield"];
						ref = stubRef(gfPath);
            geo = makeGeo(STUB_DATA, ref, true);
            spyOn($log, "info").and.callThrough();
            spyOn($q, "reject").and.callThrough();
        });

        afterEach(function() {
            geo = null;
            ref = null;
            geoMngr = null;
        });

        it("factory instance should have all geofire methods", function() {
            expect(geo).toEqual(jasmine.objectContaining({
							distance: jasmine.any(Function),
							get: jasmine.any(Function),
							set: jasmine.any(Function),
							remove: jasmine.any(Function),
							query: jasmine.any(Function),
						}));
        });

        describe("Properties that don't return a promise", function() {

            describe("Path", function() {
                it("should equal the constructor's argument", function() {
									var path = "Mock://" + gfPath;
                    expect(geo.path()).toEqual(path);
                });
            });
            describe("Ref", function() {
                it("should equal a firebase reference", function() {
                    expect(geo.ref()).toEqual(ref);
                });
            });
        });
        describe("main geofire functions", function() {
            beforeEach(function() {
								base = geo.base();
                spy = jasmine.createSpyObj("", ["get", "ref","set", "remove", "query", "distance"]);
                spyOn($q, "when").and.returnValue(spy);
            });

            describe("ref", function() {
                it("should call set on the geofire object with passed key and coords arguments", function() {
                    geo.ref()
                    expect(spy.ref.calls.count()).toEqual(1);
                });
								it("should not be a promise",function(){
									expect(geo.ref()).not.toBeAPromise();
								});
            });
            describe("set", function() {
                it("should call set on the geofire object with passed key and coords arguments", function() {
                    geo.set(key, coords);
                    $rootScope.$digest();
                    $rootScope.$digest();
                    expect(spy.set).toHaveBeenCalledWith(key, coords);
                    expect($q.reject).not.toHaveBeenCalled();
                });
            });
            // describe("query", function() {
            //     it("should call query on the geofire object with passed data object argument", function() {
            //         geo.query(data);
            //         $rootScope.$digest();
            //         expect(gfSpy.query).toHaveBeenCalledWith(data);
            //     });
            // });
            // describe("remove", function() {
            //     it("should call $remove on the $geofire object with passed key argument", function() {
            //         geo.remove(key);
            //         $rootScope.$digest();
            //         expect(gfSpy.remove).toHaveBeenCalledWith(key);
            //     });
            // });
            // describe("get", function() {
            //     it("should call $get on the $geofire object with passed key argument", function() {
            //         geo.get(key);
            //         $rootScope.$digest();
            //         expect(gfSpy.get).toHaveBeenCalledWith(key);
            //     });
            // });
            // describe("distance", function() {
            //     it("should call $distance on the $geofire object with passed key argument", function() {
            //         geo.distance(location.a, location.b);
            //         $rootScope.$digest();
            //         expect(gfSpy.distance.calls.argsFor(0)[0]).toEqual(location.a);
            //         expect(gfSpy.distance.calls.argsFor(0)[1]).toEqual(location.b);
            //     });
        });
        describe("geoQueries", function() {
            beforeEach(function() {
                // $rootScope.$digest();
            });
            describe("constructor", function() {
                // it("should return a geoQuery object", function() {
                //     ref = geoMock.refWithPath(gfPath);
                //     spyOn($q, "when").and.callThrough();
                //     spyOn(geoRef, "ref").and.returnValue(geoMock.geoSpyObj);
                //     geo = geoMngr(gfPath)
                //     geo.query(data);
                //     $rootScope.$digest();
                //     expect($q.when.calls.argsFor(1)[0]).toEqual(jasmine.objectContaining({
                //         center: jasmine.any(Function),
                //         radius: jasmine.any(Function),
                //         on: jasmine.any(Function),
                //         cancel: jasmine.any(Function),
                //         updateCriteria: jasmine.any(Function)
                //     }));
                // });
                // });

            });


            // describe("Testing return value", function() {
            //     beforeEach(function() {
            //         spyOn($q, "when").and.callThrough();
            //         obj = geoMock.make(gfPath, STUB_DATA);
            //     });

            //     it("should return a geofire object wrapped in a promise", function() {
            //         obj.query(data);
            //         expect($q.when.calls.argsFor(0)[0]).toEqual(jasmine.objectContaining({
            //             get: jasmine.any(Function),
            //             set: jasmine.any(Function),
            //             remove: jasmine.any(Function),
            // ref: jasmine.any(Function),
            //             query: jasmine.any(Function)
            //         }));
            //     });

            // });


        });

        function stubRef(path) {
            var mockPath = path.join('/'); //baseBuilder changes array to string
            return new MockFirebase('Mock://').child(mockPath);
        }

        function makeGeo(initialData, path, flag) {

            if (!path) {
                path = stubRef();
                flag = true;
            }

            var geo = fireStarter("geo", path, flag);

            if (initialData) {
                geo.ref().set(initialData);
                geo.ref().flush();
                // $timeout.flush();
            }
            return geo;
        }

    });


})();
