(function(){
	"use strict";
    describe("User Factory", function() {
        var afEntity, deferred, user, $q, $rootScope, mockAuth;

        beforeEach(function() {
            MockFirebase.override();
            module("srvc.auth");
            module("fb.utils");
            module("fbMocks");
            inject(function( _afEntity_, _$q_, _user_,  _$rootScope_, _mockAuth_) {
                $rootScope = _$rootScope_;
                $q = _$q_;
								user = _user_;
								afEntity = _afEntity_;
                mockAuth = _mockAuth_;
            });
        });
        afterEach(function() {
            mockAuth = null;
						user = null;
        });

				it("findById", function(){

					var test = user.findById(1);
					expect(test.$id).toEqual('1');
				});
		});
})();

