(function() {
    "use strict";

    describe("FirePath factory", function() {
        var path, fuel, ref, utils, fireEntity, session, test, options, userId, spy, options, firePath, $rootScope, rootPath, $q, $log, $injector;

        beforeEach(function() {
            angular.module("fireStarter.services")
                .factory("session", function() {
                    return {
                        getId: jasmine.createSpy("getId").and.callFake(function() {
                            userId = 1;
                            return userId;
                        })
                    }
                });
            module("fireStarter.services");
            inject(function(_fireEntity_, _utils_, _firePath_, _$rootScope_, _$q_, _$log_, _$injector_) {
                utils = _utils_;
                fireEntity = _fireEntity_;
                $rootScope = _$rootScope_;
                $injector = _$injector_;
                firePath = _firePath_;
                $q = _$q_;
                $log = _$log_;
            });
            rootPath = "https://your-firebase.firebaseio.com/";
            options = {
                sessionAccess: true,
                geofire: true,
                sessionLocation: "session",
                sessionIdMethod: "getId",
                locationName: "locations",
                geofireName: "geofire"
            };
            path = firePath("trips", options);
            fuel = fireEntity("trips");
        });
        afterEach(function() {
            path = null;
            spy = null;
            $rootScope = null;
            firePath = null;
        });
        describe("Constructor", function() {
            it("should work", function() {
                expect(path).toBeDefined();
            });
            it("should have correct methods", function() {
                expect(path).toEqual(jasmine.objectContaining({
                    mainArray: jasmine.any(Function),
                    mainRecord: jasmine.any(Function),
                    nestedArray: jasmine.any(Function),
                    nestedRecord: jasmine.any(Function),
                    makeNestedRef: jasmine.any(Function)
                }));

            });
        });

        var paths = [
            ["mainArray", "trips"],
            ["mainRecord", "trips/1", "1"],
            ["nestedArray", "trips/1/hotels", "1", "hotels"],
            ["nestedRecord", "trips/1/hotels/5", "1", "hotels", "5"],
            ["makeNestedRef", "trips/1/hotels/5/rooms/100", "1/hotels/5/rooms", "100"],
            ["makeNestedRef", "trips/1/hotels/5/rooms/100", [1, 'hotels', 5, 'rooms'], "100"],
            ["userNestedArray", "users/1/trips"],
            ["userNestedRecord", "users/1/trips/5", "5"],
            ["geofireArray", "geofire/trips"],
            ["geofireRecord", "geofire/trips/5", "5"],
            ["mainLocationsArray", "locations/trips"],
            ["mainLocationsRecord", "locations/trips/5", "5"]
        ];

        function testPaths(y) {
            describe(y[0] + "()", function() {

                it("should be a firebaseRef", function() {
                    expect(path[y[0]](y[2], y[3], y[4])).toBeAFirebaseRef();
                });

                it("should create the correct path", function() {
                    expect(path[y[0]](y[2], y[3], y[4]).path).toEqual(rootPath + y[1]);
                });
            });
        }

        paths.forEach(testPaths);


        describe("rootRef", function() {
            it("is a firebaseRef", function() {
                expect(path.rootRef()).toBeAFirebaseRef();
            });
            it("should create the correct path", function() {
                expect(path.rootRef().path).toEqual(rootPath);
            });
        });

        describe("setCurrentRef", function() {
            beforeEach(function() {
                ref = new MockFirebase("data").child("child");
            });
            it("should set ref if passed a firebaseRef", function() {
                path.setCurrentRef(ref);
                $rootScope.$digest();
                $rootScope.$digest();
                // expect(path.gsetCurrentPath).toHaveBeenCalledWith("data/child");
                expect(path.getCurrentRef()).toEqual(ref);
            });

        });
        describe("checkPathParams", function() {
            beforeEach(function() {
                ref = new MockFirebase(rootPath);;
                spyOn(path, "setCurrentRef");
            });
            describe("without currentRef", function() {
                it("should create a new ref with correct path", function() {
                    test = ["trips", "1"];
                    spyOn(path, "getCurrentRef").and.returnValue(undefined);
                    path.checkPathParams(test);
                    expect(path.getCurrentPath()).toEqual(rootPath + "trips/1");
                    expect(path.getCurrentPath()).toEqual(rootPath + "trips/1");
                });

            });
        });
        describe("Invalid options", function() {
            describe("session", function() {
                it("should throw error if no sessionLocation is present", function() {
                    expect(function() {
                        options = {
                            sessionAccess: true,
                            sessionIdMethod: "getId"
                        };
                        firePath("trips", options);

                    }).toThrow();
                });
                it("should throw error if no sessionIdMethod is present", function() {
                    expect(function() {
                        options = {
                            sessionAccess: true,
                            sessionLocation: "session"
                        };
                        firePath("trips", options);

                    }).toThrow();
                });

            });

        });

        var currentPaths = [
            ["currentRecord", "100"],
            ["currentParentNode", "rooms"],
            ["currentNode", "1000"],
            ["currentNestedArray", "hotels"],
            ["currentNestedRecord", "5"],
            ["currentDepth", 6],
            ["nodeIdx", 4, "rooms"],
        ];

        function testCurrentPath(y) {
            describe(y[0], function() {
                beforeEach(function() {
                    this.relativePath = "trips/100/hotels/5/rooms/1000";
                    this.fullPath = rootPath + this.relativePath;
                });

                it("should not work if pass a relative string ", function() {
                    expect(function() {
                        path[y[0]](this.relativePath);
                    }).toThrow();
                });
                it("should not work if pass array", function() {
                    expect(function() {
                        path[y[0]](this.relativePath.split('/'));
                    }).toThrow();
                });
                it("should return correct value", function() {
                    expect(path[y[0]](this.fullPath, y[2])).toEqual(y[1]);
                });
            });
        }
        currentPaths.forEach(testCurrentPath);

    });


})();
