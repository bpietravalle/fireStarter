(function(angular) {
    'use strict';
    var module;
    describe("fb.services Module:", function() {
        beforeEach(function() {
            module = angular.module("fb.services");
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
                deps = module.value('fb.services').requires;
            });
            it("should depend on fb.srvc.dataMngr", function() {
                expect(hasModule('fb.srvc.dataMngr')).toBeTruthy();
            });
        });
    });
})(angular);