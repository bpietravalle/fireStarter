(function(angular) {
    'use strict';
    var module;
    describe("fireStarter.utils Module:", function() {
        beforeEach(function() {
            module = angular.module("fireStarter.utils");
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
                deps = module.value('fireStarter.utils').requires;
            });
            it("should depend on index.constants", function() {
                expect(hasModule('index.constants')).toBeTruthy();
            });
            it("should depend on firebase", function() {
                expect(hasModule('firebase')).toBeTruthy();
            });
        });
    });
})(angular);
