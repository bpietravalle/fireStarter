(function(angular) {
    'use strict';
    var module;
    describe("srvc.auth Module:", function() {
        beforeEach(function() {
            module = angular.module("srvc.auth");
        });

        it("should exist", function() {
            expect(module).toBeDefined();
        });
        describe("Dependencies:", function() {
            var deps;
            var hasModule = function(m) {
                return deps.indexOf(m) >= 0;
            };
            beforeEach(function() {
                deps = module.value('srvc.auth').requires;
            });
            it("should depend on srvc.session", function() {
                expect(hasModule('srvc.session')).toBeTruthy();
            });
            it("should depend on srvc.dataFactories", function() {
                expect(hasModule('srvc.dataFactories')).toBeTruthy();
            });
            it("should depend on fb.utils", function() {
                expect(hasModule('fb.utils')).toBeTruthy();
            });
        });
    });
})(angular);

