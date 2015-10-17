(function() {
    "use strict";

    describe("GeoRef", function() {
        var geo, test, fbRef, geoExample, geoMock, $rootScope, $q, geoRef, gfPath, fbRef;

        beforeEach(function() {
            module("fbMocks");
            module("utils.gfApi");
            inject(function(_$q_, _$rootScope_, _geoMock_, _fbRef_, _geoRef_) {
                fbRef = _fbRef_;
                geoRef = _geoRef_;
                $rootScope = _$rootScope_;
                geoMock = _geoMock_;
                $q = _$q_;
            });
            gfPath = ["feeders"];
						spyOn(fbRef,"ref").and.callThrough();
        });

        afterEach(function() {
            test = null;
        });

        it("should be defined", function() {
            expect(geoRef).toBeDefined();
        });
        it("should pass path to fbRef.ref()", function() {
            geoRef(gfPath);
            expect(fbRef.ref.calls.argsFor(0)[0]).toEqual(gfPath);
        });
				it("should throw an error if no path is provided", function(){
					expect(function(){
						geoRef();
					}).toThrow();

				});


    });

})();
