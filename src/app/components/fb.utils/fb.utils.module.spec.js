(function(angular) {
    'use strict';
    var module;
    describe("fb.utils Module:", function() {
        beforeEach(function() {
            module = angular.module("fb.utils");
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
                deps = module.value('fb.utils').requires;
            });
            it("should depend on Firebase", function() {
                expect(hasModule('firebase')).toBeTruthy();
            });
        });
    });
})(angular);

