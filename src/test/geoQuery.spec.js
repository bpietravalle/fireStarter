(function() {
    "use strict";
    describe('GeoQuery', function() {
        var querySpy, extension, subject, rootPath, success, failure, fireStarter, ref, test, test1, $log, $rootScope, deferred, root, path, $q, $timeout;


        beforeEach(function() {
            rootPath = "https://your-firebase.firebaseio.com";
            angular.module("firebase.starter")
                .config(function(fireStarterProvider) {
                    fireStarterProvider.setRoot(rootPath);
                });
            module('firebase.starter');
            inject(function(_fireStarter_, _$log_, _$rootScope_, _$q_, _$timeout_) {
                $log = _$log_;
                fireStarter = _fireStarter_;
                $timeout = _$timeout_;
                $rootScope = _$rootScope_;
                $q = _$q_;
                deferred = $q.defer();
            });
            spyOn($log, "info").and.callThrough();
            spyOn($q, "reject").and.callThrough();

            ref = new MockFirebase(rootPath).child("geofire");

            querySpy = {
                startAt: function() {
                    return {
                        endAt: function() {
                            return {
                                on: function() {}
                            }

                        }
                    }
                },
            };
            extension = {
                orderByChild: jasmine.createSpy("child").and.returnValue(querySpy)
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

        var meth = ["radius", "center", "updateCriteria", "on", "cancel"]

        function definedTest(y) {
            it(y + " should be defined", function() {
                expect(getPromValue(test)[y]).toBeDefined();
            });
            it(y + " should be a function", function() {
                expect(getPromValue(test)[y]).toBeA("function");
            });
        }
				meth.forEach(definedTest);


        function wrapPromise(p) {
            return p.then(success, failure);
        }

        function getPromValue(obj) {
            return obj.$$state.value;
        }
    });
})(angular);
