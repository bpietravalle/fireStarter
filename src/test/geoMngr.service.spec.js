(function() {
    "use strict";

    describe("GeoMngr Service", function() {
        var geo, angular, STUB_DATA, $timeout, result, $log, failure, successSpy, failureSpy, NEW_DATA, geoExample, geoMock, location, radius, $rootScope, $q, gfPath, gfSpy, gfName, deferred, $provide, mockObj, ref, obj, data, geoMngr, geoRef, key, field, coords;

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
            gfPath = ["geofield"];

            ref = geoMock.refWithPath(gfPath);
            spyOn($log, "info").and.callThrough();
            spyOn($q, "reject").and.callThrough();
        });

        afterEach(function() {
            geo = null;
            ref = null;
            geoMngr = null;
        });

        it("factory should be defined", function() {
            expect(geoMngr).toBeDefined();
        });
        it("factory instance should be defined", function() {
            expect(geoMngr(gfPath)).toBeDefined();
        });
        describe("Constructor", function() {
            beforeEach(function() {
                spyOn(geoRef, "ref").and.returnValue(ref);
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
        describe("main geofire functions", function() {
            beforeEach(function() {
                ref = geoMock.refWithPath(gfPath);
                gfSpy = jasmine.createSpyObj("geofire", ["get", "set", "remove", "query", "distance"]);
                spyOn($q, "when").and.callThrough();
                spyOn(geoRef, "ref").and.returnValue(gfSpy);
                geoExample = geoMngr(gfPath);
            });

            describe("set", function() {
                it("should call set on the geofire object with passed key and coords arguments", function() {
                    geoExample.set(key, coords);
                    $rootScope.$digest();
                    expect(gfSpy.set).toHaveBeenCalledWith(key, coords);
                    expect($q.reject).not.toHaveBeenCalled();
                });
            });
            describe("query", function() {
                it("should call query on the geofire object with passed data object argument", function() {
                    geoExample.query(data);
                    $rootScope.$digest();
                    expect(gfSpy.query).toHaveBeenCalledWith(data);
                });
            });
            describe("remove", function() {
                it("should call $remove on the $geofire object with passed key argument", function() {
                    geoExample.remove(key);
                    $rootScope.$digest();
                    expect(gfSpy.remove).toHaveBeenCalledWith(key);
                });
            });
            describe("get", function() {
                it("should call $get on the $geofire object with passed key argument", function() {
                    geoExample.get(key);
                    $rootScope.$digest();
                    expect(gfSpy.get).toHaveBeenCalledWith(key);
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
        describe("geoQueries", function() {
            beforeEach(function() {
                // $rootScope.$digest();
            });
            describe("constructor", function() {
                it("should return a geoQuery object", function() {
                    ref = geoMock.refWithPath(gfPath);
                    spyOn($q, "when").and.callThrough();
                    spyOn(geoRef, "ref").and.returnValue(geoMock.geoSpyObj);
                    geoExample = geoMngr(gfPath)
                    geoExample.query(data);
                    $rootScope.$digest();
                    expect($q.when.calls.argsFor(1)[0]).toEqual(jasmine.objectContaining({
                        center: jasmine.any(Function),
                        radius: jasmine.any(Function),
                        on: jasmine.any(Function),
                        cancel: jasmine.any(Function),
                        updateCriteria: jasmine.any(Function)
                    }));
                });
            });
            describe("geoQuery functions", function() {
                function wrapQuery(d) {
                    geoExample = geoMngr(gfPath)
                    $rootScope.$digest();
                    geoExample.query(d)
                    $rootScope.$digest();
                    $rootScope.$digest();
                    return this;
                }

                beforeEach(function() {
                    spyOn(geoRef, "ref").and.returnValue(geoMock.geoSpyObj);
                    spyOn($q, "when").and.callThrough();
                });
                // it("should call center on the geoQueryObj", function() {
                //     wrapQuery(data).center();
                //     expect(geoQuerySpy.center).toHaveBeenCalled();
                // });

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


        /*Helpers from angularFire*/


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
