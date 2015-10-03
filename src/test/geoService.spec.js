(function() {
    "use strict";

    describe("Geo Service", function() {
        var geo, $q, path, deferred, mockObj, ref, obj, data, geoMngr, fbRef, key, field, coords, $geofire, correct_key;

        beforeEach(function() {
            module("fbMocks");
            module("fb.services");
            inject(function(_geoMngr_, _$q_, _mockObj_, _fbRef_, _$geofire_) {
                fbRef = _fbRef_;
                mockObj = _mockObj_;
                $geofire = _$geofire_;
                geoMngr = _geoMngr_;
                $q = _$q_;
            });
            key = "a_key";
            coords = [90, 150];
            path = "geofield";
            obj = mockObj.makeObject();
            spyOn(fbRef, "ref").and.returnValue(obj);
            spyOn($q, "when");
        });

        afterEach(function() {
            geo = null;
            correct_key = null;
        });

        it("should be defined", function() {
            expect(geoMngr).toBeDefined();
        });
        describe("Field", function() {
            it("should have a field Geofire", function() {
                expect(geoMngr.field("url")).toBeAPromise();
            });
            it("should be an object with $geofire methods", function() {
                expect(geoMngr.field("url")).toEqual(jasmine.objectContaining({
                    $get: jasmine.any(Function),
                    $set: jasmine.any(Function),
                    $remove: jasmine.any(Function),
                    $distance: jasmine.any(Function),
                    $query: jasmine.any(Function)
                }));
            });
        });
        // describe("remove", function() {
        //     beforeEach(function() {
        //         geo.remove(key);
        //     });
        //     it("should call $remove with correct args", function() {
        //         expect(field.$remove).toHaveBeenCalledWith(key);
        //     });
        // });
        // describe("set", function() {
        //     beforeEach(function() {
        //         geo.set(key);
        //     });
        //     it("should call $set with correct args", function() {
        //         expect(field.$set).toHaveBeenCalledWith(key);
        //     });
        // });
        // describe("get", function() {
        //     beforeEach(function() {
        //         geo.get(key);
        //     });
        //     it("should call $get with correct args", function() {
        //         expect(field.$get).toHaveBeenCalledWith(key);
        //     });
        // });
        // describe("query", function(){
        // beforeEach(function(){
        // data = {
        // center: [90,150],
        // radius: 0.1,
        // };
        // spyOn(field, "$query");
        // geo.query(data);
        // });
        // it("should call $query with correct args", function(){
        // expect(field.$query).toHaveBeenCalledWith(data);
        // });

        // });

    });


})();
