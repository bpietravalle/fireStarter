(function(angular) {
    'use strict';
    var module;
    describe("srvc.dataFactories Module:", function() {
        beforeEach(function() {
            module = angular.module("srvc.dataFactories");
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
                deps = module.value('srvc.dataFactories').requires;
            });
            it("should depend on srvc.dataMngr", function() {
                expect(hasModule('srvc.dataMngr')).toBeTruthy();
            });
        });
    });
})(angular);
