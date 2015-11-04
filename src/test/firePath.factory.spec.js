(function() {
    "use strict";

    describe("FirePath factory", function() {
        var path, session, options, userId, spy, options, firePath, $rootScope, rootPath, $q, $log, $injector;

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
            inject(function(_firePath_, _$rootScope_, _$q_, _$log_, _$injector_) {
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
            ["userNestedRecord","users/1/trips/5","5"],
            ["geofireArray", "geofire/trips"],
            ["geofireRecord","geofire/trips/5","5"],
            ["mainLocationsArray", "locations/trips"],
            ["mainLocationsRecord","locations/trips/5","5"]
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

        describe("session", function() {
            describe("Invalid options", function() {
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
    });


})();
