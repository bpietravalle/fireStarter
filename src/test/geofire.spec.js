(function() {
    "use strict";

    describe("FireStarter-Geo", function() {
        var geo, geoQuery, base, fireStarter, baseBuilder, spy, STUB_DATA, $timeout, result, $log, failure, gfPath, NEW_DATA, location, radius, $rootScope, $q, gfSpy, deferred, $provide, ref, data, key, field, coords;
        // var demoFirebaseUrl = "https://geofire.firebaseio.com";

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
            inject(function(_fireStarter_, _$q_, _baseBuilder_, _$timeout_, _$log_, _$rootScope_) {
                baseBuilder = _baseBuilder_;
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

        describe("main geofire functions -with spies", function() {
            beforeEach(function() {
                gfSpy = jasmine.createSpyObj("spy", ["get", "set", "ref", "remove", "distance", "query"]);
                spyOn(baseBuilder, "init").and.returnValue(gfSpy);
                geo = makeGeo(null, ref, true);
                $rootScope.$digest();
                spyOn($q, "when").and.callThrough();
            });

            var methods = [
                ["get", [key]],
                ["set", [key, coords]],
                ["ref"],
                ["remove", [key]],
                ["distance", [location.a, location.b]],
                ["query", [data]]
            ];

            function testMethods(y) {
                    describe(y[0], function() {
                        if (y[0] === "ref" || y[0] === "distance" || y[0] === "query") {
                            it("should not be a promise", function() {
                                expect(geo[y[0]]).not.toBeAPromise();
                            });
                        } else {
                            it("should be a promise", function() {
                                expect(geo[y[0]]()).toBeAPromise();
                            });
                        }

                        it("should send: " + y[0] + ". to geofire object", function() {
                            geo[y[0]]();
                            $rootScope.$digest();
                            expect(gfSpy[y[0]]).toHaveBeenCalled();
                        });
                        it("should not call $q.reject", function() {
                            expect($q.reject).not.toHaveBeenCalled();
                        });

                        if (y[0] !== "ref") {
                            it("should call: " + y[0] + ". with: " + y[1], function() {
                                if (y[1].length === 1) {
                                    geo[y[0]](y[1][0])
                                    $rootScope.$digest();
                                    expect(gfSpy[y[0]]).toHaveBeenCalledWith(y[1][0]);
                                } else {
                                    geo[y[0]](y[1][0], y[1][0])
                                    $rootScope.$digest();
                                    expect(gfSpy[y[0]]).toHaveBeenCalledWith(y[1][0], y[1][0]);

                                }
                            });
                        }
                    });
                }
                methods.forEach(testMethods);
        });
        describe("return values", function() {
            beforeEach(function() {
                this.ref = stubRef(["path"]);
                this.geo = fireStarter("geo", this.ref, true);
                spyOn($q, "when").and.callThrough();
            });
            it("should return the geofireRef", function() {
                var test = this.geo.set("string", [90, 100]);
                var results;
                var spy = jasmine.createSpy('success');
                var spy1 = jasmine.createSpy('failure');
                $rootScope.$digest();
                expect($q.reject).not.toHaveBeenCalled();

                wrapPromise(test);
                test.then(spy, spy1);
                $rootScope.$digest();
                this.ref.flush();
                $rootScope.$digest();
                expect(this.geo.ref()['data']).toEqual("as");
            });

            function wrapPromise(p) {
                p.then(function(res) {
                    return res;
                }).catch(function(err) {
                    return err;
                });
            }
        });

        describe("geoQuery", function() {
            beforeEach(function() {
                spy = {
                    query: function() {
                        gfSpy = jasmine.createSpyObj("geoQuerySpy", ["center", "cancel", "radius", "updateCriteria", "on", "remove"]);
                        return gfSpy;
                    }
                }
                spyOn(baseBuilder, "init").and.returnValue(spy);
                geo = makeGeo(null, ref, true);
                geoQuery = geo.query(data);
                $rootScope.$digest();
            });
            it("should have all geofire functions", function() {
                expect(geoQuery.$$state.value).toEqual(jasmine.objectContaining({
                    center: jasmine.any(Function),
                    remove: jasmine.any(Function),
                    radius: jasmine.any(Function),
                    on: jasmine.any(Function),
                    cancel: jasmine.any(Function),
                    updateCriteria: jasmine.any(Function)
                }));
            });

            var qMeth = ["center", "radius", "updateCriteria", "on", "cancel", "remove"];

            function queryMethods(y) {
                it("should call " + y + " on the geoQuery", function() {
                    $rootScope.$digest();
                    var test = geoQuery.$$state.value
                    test[y]();
                    expect(gfSpy[y]).toHaveBeenCalled();
                });

            }
            qMeth.forEach(queryMethods);
        });


        function stubRef(path) {
            var mockPath = path.join('/');
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
            }
            return geo;
        }

    });


})();
