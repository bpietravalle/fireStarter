(function() {
    "use strict";

    describe("GeoMngr Service", function() {
        var geo, STUB_DATA, $timeout, result, $log, failure, successSpy, failureSpy, NEW_DATA, geoExample, geoMock, location, radius, $rootScope, $q, gfPath, gfSpy, gfName, deferred, $provide, mockObj, ref, obj, data, geoMngr, geoRef, key, field, coords;

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
            inject(function(_geoMngr_, _$q_, _$timeout_, _geoRef_, _$log_, _$rootScope_, _geoMock_) {
                $rootScope = _$rootScope_;
								geoRef = _geoRef_;
								$timeout = _$timeout_;
                $log = _$log_;
                geoMock = _geoMock_;
                geoMngr = _geoMngr_;
                $q = _$q_;
            });
            key = "a_key";
            gfName = "feeders";
            gfPath = ["geofield"];

            ref = geoMock.refWithPath(gfPath);
            spyOn($log, "info").and.callThrough();
        });

        afterEach(function() {
            geo = null;
            ref = null;
            geoMngr = null;
        });

        it("factory should be defined", function() {
            expect(geoMngr).toBeDefined();
        });
        it(" factory instance should be defined", function() {
            expect(geoMngr(gfPath)).toBeDefined();
        });
        describe("Constructor", function() {
            beforeEach(function() {
                spyOn(geoRef, "ref").and.returnValue(ref);
								spyOn($q,"defer")
                geoMngr(gfPath);
            });
            it("should be defined", function() {
                this.gf = geoMngr(["feederPath"]);
                expect(this.gf).toBeDefined();
            });
            it("should call geoRef in the constructor", function() {
                expect(geoRef.ref).toHaveBeenCalledWith(gfPath);
            });
        });

        describe("Properties that don't return a promise", function() {
            beforeEach(function() {
                ref = geoMock.refWithPath(gfPath);
                spyOn(geoRef, "ref").and.returnValue(ref);
                geoExample = geoMngr(gfPath);
            });

            describe("Path", function() {
                it("should equal the constructor's argument", function() {
                    expect(geoExample.path).toEqual(gfPath);
                });
            });
            describe("Ref", function() {
                it("should send path property to geoRef", function() {
                    geoExample.ref()
                    expect(geoRef.ref).toHaveBeenCalledWith(gfPath);
                });
                it("should equal a firebase reference", function() {
                    expect(geoExample.ref()).toEqual(ref);
                });
            });
        });
        describe("$geofire Functions", function() {
            beforeEach(function() {
                gfSpy = jasmine.createSpyObj("geofire", ["get", "set", "remove", "query", "distance"]);
                spyOn($q, "when").and.returnValue(gfSpy);
                geoExample = geoMngr(gfPath);

            });

            describe("set", function() {
                it("should call set on the geofire object with passed key and coords arguments", function() {
                    geoExample.set(key, coords);
                    $rootScope.$digest();
										$timeout.flush();
                    expect(gfSpy.set).toHaveBeenCalledWith(key, coords);
                });
            });
            describe("remove", function() {
                it("should call $remove on the $geofire object with passed key argument", function() {
                    geoExample.remove(key);
                    $rootScope.$digest();
										$timeout.flush();
                    expect(gfSpy.remove).toHaveBeenCalledWith(key);
                });
            });
            describe("get", function() {
                it("should call $get on the $geofire object with passed key argument", function() {
                    geoExample.get(key);
                    $rootScope.$digest();
										$timeout.flush();
                    expect(gfSpy.get).toHaveBeenCalledWith(key);
                });
            });
            describe("query", function() {
                it("should call $query on the $geofire object with passed data object argument", function() {
                    geoExample.query(data);
                    expect(gfSpy.query).toHaveBeenCalledWith(data);
                });
            });
            describe("distance", function() {
                it("should call $distance on the $geofire object with passed key argument", function() {
                    geoExample.distance(location.a, location.b);
                    $rootScope.$digest();
                    expect(gfSpy.distance.calls.argsFor(0)[0]).toEqual(location.a);
                    expect(gfSpy.distance.calls.argsFor(0)[1]).toEqual(location.b);
                });
            });

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


        /*Helpers*/


        function wrapPromise(promise) {
            geoMngr(gfPath);
            deferred.resolve(obj);
            $rootScope.$digest();
            promise.then(function(_result_) {
                status = 'resolved';
                result = _result_;
            }, function(_failure_) {
                status = 'rejected';
                failure = _failure_;
            });
        }

    });


})();
