(function(angular) {
    'use strict';
    var module;
    describe("srvc.extend Module:", function() {
        beforeEach(function() {
            module = angular.module("srvc.extend");
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
                deps = module.value('srvc.extend').requires;
            });
            it("should depend on utils.afApi", function() {
                expect(hasModule('utils.afApi')).toBeTruthy();
            });
        });
    });
})(angular);

