(function(angular) {
    'use strict';
    var module;
    describe("utils.afApi Module:", function() {
        beforeEach(function() {
            module = angular.module("utils.afApi");
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
                deps = module.value('utils.afApi').requires;
            });
            it("should depend on utils.jsApi", function() {
                expect(hasModule('utils.jsApi')).toBeTruthy();
            });
        });
    });
})(angular);

