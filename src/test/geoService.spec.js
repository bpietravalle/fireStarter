(function() {
    "use strict";

    describe("Geo Service", function() {
        var geo, $q, deferred, data, fbRef, key, field, coords, $geofire, correct_key;

        beforeEach(function() {
            module("fb.services");
            inject(function(_geo_, _$q_, _fbRef_, _$geofire_) {
                fbRef = _fbRef_;
                $geofire = _$geofire_;
                geo = _geo_;
                $q = _$q_;
                field = geo.field;
            });
            key = "a_key";
            coords = [90, 150];
        });

				afterEach(function(){
					geo = null;
					correct_key = null;
				});

        it("should be defined", function() {
            expect(geo).toBeDefined();
        });
        describe("Field", function() {
            it("should have a field Geofire", function() {
                expect(field).toBeDefined();
            });
            it("should be an object with $geofire methods", function() {
                expect(field).toEqual(jasmine.objectContaining({
                    $get: jasmine.any(Function),
                    $set: jasmine.any(Function),
                    $remove: jasmine.any(Function),
                    $distance: jasmine.any(Function),
                    $query: jasmine.any(Function)
                }));
            });
        });
        describe("Adding GeoField Objects", function() {
            beforeEach(function() {
                spyOn(field, "$set");
            });

            describe("addFeeder", function() {
                beforeEach(function() {
                    geo.addFeeder(key, coords);
                    correct_key = "FD_" + key;
                });
                it("should call $set with correct args", function() {
                    expect(field.$set).toHaveBeenCalledWith(correct_key, coords);
                });
                it("should add 'FD_' to key", function() {
                    expect(field.$set.calls.argsFor(0)[0]).toEqual(correct_key);
                });

            });
            describe("addTip", function() {
                beforeEach(function() {
                    geo.addTip(key, coords);
                    correct_key = "TIP_" + key;
                });
                it("should call $set with correct args", function() {
                    expect(field.$set).toHaveBeenCalledWith(correct_key, coords);
                });
                it("should add 'TIP_' to key", function() {
                    expect(field.$set.calls.argsFor(0)[0]).toEqual(correct_key);
                });

            });
            describe("addRequest", function() {
                beforeEach(function() {
                    geo.addRequest(key, coords);
                    correct_key = "REQ_" + key;
                });
                it("should call $set with correct args", function() {
                    expect(field.$set).toHaveBeenCalledWith(correct_key, coords);
                });
                it("should add 'REQ_' to key", function() {
                    expect(field.$set.calls.argsFor(0)[0]).toEqual(correct_key);
                });

            });
        });
        describe("Removing GeoField Objects", function() {
            beforeEach(function() {
                spyOn(field, "$remove");
            });

            describe("removeFeeder", function() {
                beforeEach(function() {
                    geo.removeFeeder(key);
                    correct_key = "FD_" + key;
                });
                it("should call $remove with correct args", function() {
                    expect(field.$remove).toHaveBeenCalledWith(correct_key);
                });
                it("should remove 'FD_' to key", function() {
                    expect(field.$remove.calls.argsFor(0)[0]).toEqual(correct_key);
                });

            });
            describe("removeTip", function() {
                beforeEach(function() {
                    geo.removeTip(key);
                    correct_key = "TIP_" + key;
                });
                it("should call $remove with correct args", function() {
                    expect(field.$remove).toHaveBeenCalledWith(correct_key);
                });
                it("should remove 'TIP_' to key", function() {
                    expect(field.$remove.calls.argsFor(0)[0]).toEqual(correct_key);
                });

            });
            describe("removeRequest", function() {
                beforeEach(function() {
                    geo.removeRequest(key);
                    correct_key = "REQ_" + key;
                });
                it("should call $remove with correct args", function() {
                    expect(field.$remove).toHaveBeenCalledWith(correct_key);
                });
                it("should remove 'REQ_' to key", function() {
                    expect(field.$remove.calls.argsFor(0)[0]).toEqual(correct_key);
                });

            });
        });
        describe("remove", function() {
            beforeEach(function() {
                spyOn(field, "$remove");
                geo.remove(key);
            });
            it("should call $remove with correct args", function() {
                expect(field.$remove).toHaveBeenCalledWith(key);
            });
        });
        describe("get", function() {
            beforeEach(function() {
                spyOn(field, "$get");
                geo.get(key);
            });
            it("should call $get with correct args", function() {
                expect(field.$get).toHaveBeenCalledWith(key);
            });
        });
				describe("query", function(){
					beforeEach(function(){
						data = {
							center: [90,150],
							radius: 0.1,
						};
						spyOn(field, "$query");
						geo.query(data);
					});
					it("should call $query with correct args", function(){
						expect(field.$query).toHaveBeenCalledWith(data);
					});

				});

    });


})();
