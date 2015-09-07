(function(angular) {
    'use strict';
    var module;
    describe("fb.srvc.auth Module:", function() {
        beforeEach(function() {
            module = angular.module("fb.srvc.auth");
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
                deps = module.value('fb.srvc.auth').requires;
            });
            it("should depend on fb.srvc.session", function() {
                expect(hasModule('fb.srvc.session')).toBeTruthy();
            });
            it("should depend on fb.srvc.dataFactories", function() {
                expect(hasModule('fb.srvc.dataFactories')).toBeTruthy();
            });
        });
    });
})(angular);

