(function(angular) {
    'use strict';
    var module;
    describe("fireStarter.services Module:", function() {
        beforeEach(function() {
            module = angular.module("fireStarter.services");
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
                deps = module.value('fireStarter.services').requires;
            });
            it("should depend on platanus.inflector", function() {
                expect(hasModule("platanus.inflector")).toBeTruthy();
            });
            it("should depend on fireStarter.utils", function() {
                expect(hasModule("fireStarter.utils")).toBeTruthy();
            });
        });
    });
})(angular);
