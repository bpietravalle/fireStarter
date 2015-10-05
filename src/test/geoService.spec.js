(function() {
    "use strict";

    describe("GeoMngr Service", function() {
        var geo, geoExample, location, radius, $rootScope, $q, gfPath, gfSpy, gfName, deferred, $provide, mockObj, ref, obj, data, geoMngr, fbRef, key, field, coords, $geofire;

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
            inject(function(_geoMngr_, _$q_, _$rootScope_, _mockObj_, _fbRef_, _$geofire_) {
                $rootScope = _$rootScope_;
                fbRef = _fbRef_;
                mockObj = _mockObj_;
                $geofire = _$geofire_;
                geoMngr = _geoMngr_;
                $q = _$q_;
            });
            key = "a_key";
            gfName = "feeders";
            gfPath = ["geofield"];
            ref = mockObj.refWithPath(gfPath);
            obj = mockObj.makeObject();
            spyOn(fbRef, "ref").and.returnValue(ref);
            spyOn($q, "when").and.callThrough();
        });

        afterEach(function() {
            geo = null;
        });

        it("should be defined", function() {
            expect(geoMngr).toBeDefined();
        });
        describe("Build", function() {
            it("should be defined", function() {
                var g = new geoMngr.build("feeders", ["feederPath"]);
                expect(g).toBeDefined();
            });
            it("should throw an error if name and ref aren't present", function() {
                expect(function() {
                    new geoMngr.build("asdf");
                }).toThrow();
                expect(function() {
                    new geoMngr.build(null, "asdf");
                }).toThrow();
            });
        });

        describe("Properties", function() {
            beforeEach(function() {
                geoExample = new geoMngr.build(gfName, gfPath);
            });

            describe("Name", function() {
                it("should equal the first argument", function() {
                    expect(geoExample.name).toEqual(gfName);
                });
            });
            describe("Path", function() {
                it("should equal the second argument", function() {
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
            describe("Instance", function() {
                it("should return a $geofire object wrapped in a promise", function() {
                    geoExample.instance();
                    $rootScope.$digest();
                    expect($q.when.calls.argsFor(0)[0]).toEqual(jasmine.objectContaining({
                        $get: jasmine.any(Function),
                        $set: jasmine.any(Function),
                        $remove: jasmine.any(Function),
                        $distance: jasmine.any(Function),
                        $query: jasmine.any(Function)
                    }));
                });
								it("should be a promise", function(){
									expect(geoExample.instance()).toBeAPromise();
								});
            });
            describe("$geofire Functions", function() {
                beforeEach(function() {
                    gfSpy = jasmine.createSpyObj("$geofire", ["$get", "$distance", "$query", "$remove", "$set"]);

                    spyOn(geoExample, "instance").and.callFake(function() {
                        deferred = $q.defer();
                        return deferred.promise;
                    });
                });
                describe("set", function() {
                    it("should call $set on the instance with passed key and coords arguments", function() {
                        geoExample.set(key, coords);
                        deferred.resolve(gfSpy);
                        $rootScope.$digest();
                        expect(gfSpy.$set).toHaveBeenCalledWith(key, coords);
                    });
                });
                describe("remove", function() {
                    it("should call $remove on the instance with passed key argument", function() {
                        geoExample.remove(key);
                        deferred.resolve(gfSpy);
                        $rootScope.$digest();
                        expect(gfSpy.$remove).toHaveBeenCalledWith(key);
                    });
                });
                describe("get", function() {
                    it("should call $get on the instance with passed key argument", function() {
                        geoExample.get(key);
                        deferred.resolve(gfSpy);
                        $rootScope.$digest();
                        expect(gfSpy.$get).toHaveBeenCalledWith(key);
                    });
                });
                describe("query", function() {
                    it("should call $query on the instance with passed data object argument", function() {
                        geoExample.query(data);
                        deferred.resolve(gfSpy);
                        $rootScope.$digest();
                        expect(gfSpy.$query).toHaveBeenCalledWith(data);
                    });
                });
                describe("distance", function() {
                    it("should call $distance on the instance with passed key argument", function() {
                        geoExample.distance(location.a, location.b);
                        deferred.resolve(gfSpy);
                        $rootScope.$digest();
                        expect(gfSpy.$distance.calls.argsFor(0)[0]).toEqual(location.a);
                        expect(gfSpy.$distance.calls.argsFor(0)[1]).toEqual(location.b);
                    });
                });

            });
        });


        // it("should be an object with $geofire methods", function() {
        //     expect(geoMngr.field("url")).toEqual(jasmine.objectContaining({
        //         $get: jasmine.any(Function),
        //         $set: jasmine.any(Function),
        //         $remove: jasmine.any(Function),
        //         $distance: jasmine.any(Function),
        //         $query: jasmine.any(Function)
        //     }));
        // });
        // describe("remove", function() {
        //     beforeEach(function() {
        //         geo.remove(key);
        //     });
        //     it("should call $remove with correct args", function() {
        //         expect(field.$remove).toHaveBeenCalledWith(key);
        //     });
        // });
        // describe("set", function() {
        //     beforeEach(function() {
        //         geo.set(key);
        //     });
        //     it("should call $set with correct args", function() {
        //         expect(field.$set).toHaveBeenCalledWith(key);
        //     });
        // });
        // describe("get", function() {
        //     beforeEach(function() {
        //         geo.get(key);
        //     });
        //     it("should call $get with correct args", function() {
        //         expect(field.$get).toHaveBeenCalledWith(key);
        //     });
        // });
        // describe("query", function(){
        // beforeEach(function(){
        // data = {
        // center: [90,150],
        // radius: 0.1,
        // };
        // spyOn(field, "$query");
        // geo.query(data);
        // });
        // it("should call $query with correct args", function(){
        // expect(field.$query).toHaveBeenCalledWith(data);
        // });

        // });

    });


})();
