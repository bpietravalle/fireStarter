(function(angular) {
    'use strict';
    var module;
    describe("utils.gfApi Module:", function() {
        beforeEach(function() {
            module = angular.module("utils.gfApi");
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
                deps = module.value('utils.gfApi').requires;
            });
            it("should depend on utils.jsApi", function() {
                expect(hasModule('utils.jsApi')).toBeTruthy();
            });
        });
    });
})(angular);

