(function(angular) {
    'use strict';
    var module;
    describe("fb Module:", function() {
        beforeEach(function() {
            module = angular.module("fb");
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
                deps = module.value('fb').requires;
            });
            it("should depend on fb.services", function() {
                expect(hasModule('fb.services')).toBeTruthy();
            });
            it("should depend on fb.utils", function() {
                expect(hasModule('fb.utils')).toBeTruthy();
            });
        });
    });
})(angular);
