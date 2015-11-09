(function(angular) {
    'use strict';
    var module;
    describe("fireStarter Module:", function() {
        beforeEach(function() {
            module = angular.module("fireStarter");
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
                deps = module.value('fireStarter').requires;
            });
            it("should depend on fireStarter.services", function() {
                expect(hasModule('fireStarter.services')).toBeTruthy();
            });
            it("should depend on fireStarter.utils", function() {
                expect(hasModule('fireStarter.utils')).toBeTruthy();
            });
        });
    });
})(angular);
