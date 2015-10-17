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
            it("should depend on utils.jsApi", function() {
                expect(hasModule('utils.jsApi')).toBeTruthy();
            });
            it("should depend on utils.afApi", function() {
                expect(hasModule('utils.afApi')).toBeTruthy();
            });
            it("should depend on utils.gfApi", function() {
                expect(hasModule('utils.gfApi')).toBeTruthy();
            });
        });
    });
})(angular);
