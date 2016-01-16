(function() {
    "use strict";
    describe('Geofire factory', function() {
        var test, subject, rootPath;


        beforeEach(function() {
            rootPath = "https://your-firebase.firebaseio.com";
            angular.module("firebase.starter")
                .config(function(fireStarterProvider) {
                    fireStarterProvider.setRoot(rootPath);
                });
            module('firebase.starter');
            inject(function(_geofire_) {
                subject = _geofire_;
            });
        });
        it("should return a function", function() {
            expect(subject).toBeAn('object');
        });
        it("should have a 'distance' method", function() {
            expect(subject.distance).toBeDefined();
            expect(subject.distance).toBeA('function');
        });
        it("should have an 'init' method", function() {
            expect(subject.init).toBeDefined();
            expect(subject.init).toBeA('function');
        });
        describe("distance()", function() {
            beforeEach(function() {
                test = subject.distance([50, 100], [49.999, 100.000111]);
            });
            it("should return a number", function() {
                expect(test).toEqual(jasmine.any(Number));
            });
        });
        describe("init()", function() {
            var ref,extension;
            beforeEach(function() {
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
                test = subject.init(ref);
            });
            it("should return a geofire object", function() {
                expect(test).toEqual(jasmine.any(Object));
            });

            var meths = ["set", "remove", "get", "query", "ref"];

            function defMeth(y) {
                it("should have a: " + y + " method defined", function() {
                    expect(test[y]).toEqual(jasmine.any(Function));
                });
            }
            meths.forEach(defMeth);
        });

    });
})();
