(function() {
    "use strict";

    describe("GeoMngr Service", function() {
        var geo, geoExample, geoMock, location, radius, $rootScope, $q, gfPath, gfSpy, gfName, deferred, $provide, mockObj, ref, obj, data, geoMngr, fbRef, key, field, coords, $geofire;

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

        it("should be defined", function() {
            expect(geoMngr).toBeDefined();
        });
        describe("Constructor", function() {
            it("should be defined", function() {
                var g = geoMngr(["feederPath"]);
                expect(g).toBeDefined();
            });
            it("should throw an error if name and ref aren't present", function() {
                expect(function() {
                    geoMngr();
                }).toThrow();
            });
            it("should return a $geofire object wrapped in a promise", function() {
                spyOn($q, "when").and.callThrough();
                geoMngr(gfPath);
                $rootScope.$digest();
                expect($q.when.calls.argsFor(0)[0]).toEqual(jasmine.objectContaining({
                    $get: jasmine.any(Function),
                    $set: jasmine.any(Function),
                    $remove: jasmine.any(Function),
                    $distance: jasmine.any(Function),
                    $query: jasmine.any(Function)
                }));
            });
            // it("should be an instanceof Geofire", function() {
            //     var g = geoMngr(["feederPath"]);
            //     expect(g).toEqual('Geofire');
            // });
        });

        describe("Properties that don't return a promise", function() {
            beforeEach(function() {
                ref = geoMock.refWithPath(gfPath);
                spyOn(fbRef, "ref").and.returnValue(ref);
                geoExample = geoMngr(gfPath);
            });

            describe("Path", function() {
                it("should equal the constructor's argument", function() {
                    expect(geoExample.path).toEqual(gfPath);
                });
            });
            describe("Ref", function() {
                it("should send path property to fbRef", function() {
                    geoExample.ref()
                    expect(fbRef.ref).toHaveBeenCalledWith(gfPath);
                });
                it("should equal a firebase reference", function() {
                    expect(geoExample.ref()).toEqual(ref);
                });
            });
        });
        describe("$geofire Functions", function() {
            beforeEach(function() {
                gfSpy = jasmine.createSpyObj("$geofire", ["$get", "$set", "$remove", "$query", "$distance"]);
                // spyOn(fbRef, "ref").and.returnValue(ref);
                spyOn($q, "when").and.callFake(function() {
                    deferred = $q.defer();
                    return deferred.promise;
                });
                geoExample = geoMngr(gfPath);

            });

            describe("set", function() {
                it("should call $set on the $geofire object with passed key and coords arguments", function() {
                    geoExample.set(key, coords);
                    deferred.resolve(gfSpy);
                    $rootScope.$digest();
                    expect(gfSpy.$set).toHaveBeenCalledWith(key, coords);
                });
            });
            describe("remove", function() {
                it("should call $remove on the $geofire object with passed key argument", function() {
                    geoExample.remove(key);
                    deferred.resolve(gfSpy);
                    $rootScope.$digest();
                    expect(gfSpy.$remove).toHaveBeenCalledWith(key);
                });
            });
            describe("get", function() {
                it("should call $get on the $geofire object with passed key argument", function() {
                    geoExample.get(key);
                    deferred.resolve(gfSpy);
                    $rootScope.$digest();
                    expect(gfSpy.$get).toHaveBeenCalledWith(key);
                });
            });
            describe("query", function() {
                it("should call $query on the $geofire object with passed data object argument", function() {
                    geoExample.query(data);
                    deferred.resolve(gfSpy);
                    $rootScope.$digest();
                    expect(gfSpy.$query).toHaveBeenCalledWith(data);
                });
            });
            describe("distance", function() {
                it("should call $distance on the $geofire object with passed key argument", function() {
                    geoExample.distance(location.a, location.b);
                    deferred.resolve(gfSpy);
                    $rootScope.$digest();
                    expect(gfSpy.$distance.calls.argsFor(0)[0]).toEqual(location.a);
                    expect(gfSpy.$distance.calls.argsFor(0)[1]).toEqual(location.b);
                });
            });

        });



    });


})();
