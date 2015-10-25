(function() {
    "use strict";

    describe("FirePath factory", function() {
        var path, serviceMock, spy, options, firePath, $rootScope, $q, $log, $injector;

        beforeEach(function() {
            angular.module("fireStarter.services")
                .factory("serviceMock", function() {
                    serviceMock = jasmine.createSpyObj("serviceMock", ["getId", "findId"]);
										return serviceMock;
                });
            module("fireStarter.services");
            inject(function(_firePath_, _$rootScope_, _$q_, _$log_, _$injector_,_serviceMock_) {
							serviceMock = _serviceMock_;
                $rootScope = _$rootScope_;
                $injector = _$injector_;
                firePath = _firePath_;
                $q = _$q_;
                $log = _$log_;
                path = firePath("path");
                $rootScope.session = jasmine.createSpyObj("session", ["getId"]);
            });
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
                    makeNested: jasmine.any(Function)
                }));

            });
        });
        describe("Available Methods", function() {
            describe("mainArray()", function() {
                it("should equal the path argument in an array", function() {
                    expect(path.mainArray()).toEqual(["path"]);
                });
                it("shouldn't create new array if path arg is already an array", function() {
                    path = firePath(["path", "path"]);
                    expect(path.mainArray()).toEqual(["path", "path"]);
                });

            });
            describe("Remaining methods", function() {
                it("mainRecord()", function() {
                    expect(path.mainRecord(1)).toEqual(["path", 1]);
                });
                it("nestedArray()", function() {
                    expect(path.nestedArray(1, "nested")).toEqual(["path", 1, "nested"]);
                });
                it("nestedRecord()", function() {
                    expect(path.nestedRecord(1, "nested", 5)).toEqual(["path",1, "nested", 5]);
                });
                it("makeNested() works when parent path is an array", function() {
                    expect(path.makeNested(["path"], "nested")).toEqual(["path", "nested"]);
                });
                it("makeNested() works when parent path is a string", function() {
                    expect(path.makeNested("path", "nested")).toEqual(["path", "nested"]);
                });

            });

        });


    });


})();
