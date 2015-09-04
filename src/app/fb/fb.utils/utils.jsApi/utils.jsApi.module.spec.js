(function(angular) {
    'use strict';
    var module;
    describe("utils.jsApi Module:", function() {
        beforeEach(function() {
            module = angular.module("utils.jsApi");
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
                deps = module.value('utils.jsApi').requires;
            });
            it("should depend on Firebase", function() {
                expect(hasModule('firebase')).toBeTruthy();
            });
            it("should depend on fb.constant", function() {
                expect(hasModule('fb.constant')).toBeTruthy();
            });
        });
    });
})(angular);
