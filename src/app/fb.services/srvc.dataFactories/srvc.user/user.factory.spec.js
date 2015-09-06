(function() {
    "use strict";
    describe("User Factory", function() {
        var afEntity, objMngr, user, $q, $rootScope, mockAuth, mockObj;

        beforeEach(function() {
            MockFirebase.override();
            module("srvc.auth");
            module("fb.utils");
            module("fbMocks");
            inject(function(_afEntity_, _$q_, _objMngr_, _user_, _$rootScope_, _mockAuth_, _mockObj_) {
                $rootScope = _$rootScope_;
                $q = _$q_;
                objMngr = _objMngr_;
                user = _user_;
                afEntity = _afEntity_;
								mockObj = _mockObj_;
                mockAuth = _mockAuth_;
            });
        });
        afterEach(function() {
            mockAuth = null;
            user = null;
            objMngr = null;
        });
        describe("findById", function() {

            it("finds the correct record", function() {
                var test = user.findById(1);
                expect(test.$id).toEqual('1');
            });
            it("doesn't return a promise", function() {
                var test = user.findById(1);
                expect(test).not.toBeAPromise();
            });
        });
        describe("methods to objMngr", function() {
            beforeEach(function() {
                spyOn(objMngr, "load").and.callThrough();
                spyOn(objMngr, "save").and.callThrough();

            });
            describe("loadById", function() {
                it("returns a promise", function() {
                    var test = user.loadById(1);
                    expect(test).toBeAPromise();
                });
                it("sends 'load' to objMngr with user obj", function() {
                    //TODO: how show that user obj comes back (without stubbing) 
                    //rather than just '1'
                    user.loadById(1);
                    expect(objMngr.load).toHaveBeenCalled();
                });
            });
            describe("save", function() {
                it("returns a promise", function() {
                    var obj = mockObj.makeObject();
                    var test = user.save(obj);
                    expect(test).toBeAPromise();
                });
                it("sends 'save' to objMngr with user obj", function() {
                    var obj = mockObj.makeObject();
                    user.save(obj);
                    expect(objMngr.save).toHaveBeenCalled();
                });
            });
        });
    });
})();
