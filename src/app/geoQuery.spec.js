(function() {
    "use strict";
    describe('GeoQuery', function() {
        var scope, extension, subject, rootPath, fireStarter, ref, test, $log, $rootScope, $q;


        beforeEach(function() {
            rootPath = "https://your-firebase.firebaseio.com";
            angular.module("firebase.starter")
                .config(function(fireStarterProvider) {
                    fireStarterProvider.setRoot(rootPath);
                });
            module('firebase.starter');
            inject(function(_fireStarter_, _$log_, _$rootScope_, _$q_) {
                $log = _$log_;
                fireStarter = _fireStarter_;
                $rootScope = _$rootScope_;
                scope = $rootScope.$new();
                $q = _$q_;
            });
            spyOn($log, "info").and.callThrough();
            spyOn($q, "reject").and.callThrough();

            ref = new MockFirebase(rootPath).child("geofire");

            function querySpy() {
                return {
                    startAt: jasmine.createSpy("startedAt").and.callFake(function() {
                        return {
                            endAt: jasmine.createSpy("endAt").and.callFake(function() {
                                return {
                                    on: jasmine.createSpy("on")
                                };

                            })
                        };
                    })
                }
            }
            extension = {
                orderByChild: jasmine.createSpy("child").and.callFake(querySpy)
            };
            angular.extend(ref, extension);

            subject = fireStarter("geo", ref, true);
        });

        beforeEach(function() {

            $rootScope.$digest();
            test = subject.query({
                center: [90, 100],
                radius: 15
            });
            $rootScope.$digest();

        });
        it("should be a promise", function() {
            expect(test).toBeAPromise();
        });
        it("should resolve to an object", function() {
            expect(getPromValue(test)).toBeAn("object");
        });

        var meth = ["radius", "broadcast", "emit", "center", "updateCriteria", "on", "cancel"]

        function definedTest(y) {
            it(y + " should be defined", function() {
                expect(getPromValue(test)[y]).toBeDefined();
            });
            it(y + " should be a function", function() {
                expect(getPromValue(test)[y]).toBeA("function");
            });
        }
        meth.forEach(definedTest);


        var eventMethods = [
            ["emit", "$emit"],
            ["broadcast", "$broadcast"]
        ];

        function testEventMeths(y) {
            describe(y[0], function() {
                var query, evt;
                beforeEach(function() {
                    spyOn(scope, y[1]).and.callThrough();
                    test = subject.query({
                        center: [90, 100],
                        radius: 1
                    });
                    $rootScope.$digest();
                    query = getPromValue(test);
                });
                it("should create a geoQueryRegistration", function() {
                    evt = query[y[0]]("key_entered", "EVENTNAME", scope);
                    expect(evt['cancel']).toEqual(jasmine.any(Function));
                });
            });
        }
        eventMethods.forEach(testEventMeths);

        function getPromValue(obj) {
            return obj.$$state.value;
        }

        //from geofire.js


    });
})(angular);
