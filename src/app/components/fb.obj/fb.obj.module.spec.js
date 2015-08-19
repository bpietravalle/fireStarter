(function(angular) {
    'use strict';
    var module;
    describe("fb.obj Module:", function() {
        beforeEach(function() {
            module = angular.module("fb.obj");
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
                deps = module.value('fb.obj').requires;
            });
            it("should depend on Firebase", function() {
                expect(hasModule('firebase')).toBeTruthy();
            });
            it("should depend on fb.utils", function() {
                expect(hasModule('fb.utils')).toBeTruthy();
            });
        });
    });
})(angular);

