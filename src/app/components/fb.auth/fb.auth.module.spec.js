(function(angular) {
    'use strict';
    var module;
    describe("fb.auth Module:", function() {
        beforeEach(function() {
            module = angular.module("fb.auth");
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
                deps = module.value('fb.auth').requires;
            });
            it("should depend on Firebase", function() {
                expect(hasModule('firebase')).toBeTruthy();
            });
        });
    });
})(angular);

