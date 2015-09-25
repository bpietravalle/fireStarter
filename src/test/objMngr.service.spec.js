(function() {
    "use strict";
    describe("objMngr", function() {
        var objMngr, scope, varName, recId, $q, newData, userData, newObj, path, afEntity, error, mockObj, obj, deferred, ref, $rootScope;
        var FIXTURE_DATA = {
            aString: 'alpha',
            aNumber: 1,
            aBoolean: false,
            anObject: {
                bString: 'bravo'
            }
        };

        userData = {
            first_name: 'billy bob',
            email: "theemail@email.com",
            phone: "202-202-1111",
        };

        beforeEach(function() {
            module('fb.srvc.dataMngr');
            module("fbMocks");
            recId = 123;
            path = ["users", recId];
            inject(function(_mockObj_, _$q_, _objMngr_, _afEntity_, _$rootScope_) {
                afEntity = _afEntity_;
                objMngr = _objMngr_;
                $q = _$q_;
                $rootScope = _$rootScope_;
                mockObj = _mockObj_;
                ref = mockObj.refWithPath(path);

            });
            spyOn($q, "reject");
        });
        afterEach(function() {
            obj = null;
            ref = null;
        });
        describe("FirebaseObject API Wrapper", function() {
            beforeEach(function() {
                obj = mockObj.makeObject(FIXTURE_DATA, ref);
            });

            describe('build', function() {
                beforeEach(function() {
                    spyOn(afEntity, "set").and.returnValue(obj);
                });
                describe("Implementing $q.when", function() {
                    beforeEach(function() {
                        spyOn($q, "when").and.callThrough();
                        objMngr.build(path)
                    });
                    it('should call $q.when 1 time', function() {
                        expect($q.when.calls.count()).toEqual(1);
                    });
                    it("should call afEntity with 'object' and path", function() {
                        expect(afEntity.set.calls.argsFor(0)[1]).toEqual(path);
                        expect(afEntity.set.calls.argsFor(0)[0]).toEqual('object');
                    });
                    it('should call $q.when with correct object', function() {
                        expect($q.when).toHaveBeenCalledWith(obj);
                    });
                    it('should return the object wrapped in a promise', function() {
                        var test = objMngr.build(path)
                        $rootScope.$digest();
                        expect(test.$$state.value).toEqual(obj);

                    });

                });
                describe("Stubbing $q.when: ", function() {
                    beforeEach(function() {
                        spyOn($q, "when").and.callFake(function() {
                            deferred = $q.defer();
                            return deferred.promise;
                        });
                    });
                    describe("$q.when Resolved: ", function() {
                        beforeEach(function() {
                            objMngr.build(path)
                            deferred.resolve(obj);
                            $rootScope.$digest();
                        });
                        it('should return correct value wrapped in a promise', function() {
                            expect(deferred.promise.$$state.value).toEqual(obj);
                        });
                    });
                    describe("$q.when Rejected: ", function() {
                        beforeEach(function() {
                            objMngr.build(path)
                            error = "Error!";
                            deferred.reject(error);
                            $rootScope.$digest();
                        });
                        it('should return correct error wrapped in a promise', function() {
                            expect(deferred.promise.$$state.value).toEqual(error);
                        });
                        it("should call $q.reject", function() {
                            expect($q.reject).toHaveBeenCalledWith(error);
                        });
                    });
                });
            });
            describe('save', function() {
                beforeEach(function() {
                    spyOn($q, "when").and.callFake(function() {
                        deferred = $q.defer();
                        return deferred.promise;
                    });
                });
                it('should call $q.when with the firebaseobject', function() {
                    objMngr.save(obj);
                    expect($q.when).toHaveBeenCalledWith(jasmine.any(Function));
                    expect($q.when).not.toHaveBeenCalledWith(obj);
                });
                describe("build() Resolved: ", function() {
                    beforeEach(function() {
                        obj.email = "NEWEMAIL@email.com";
                        objMngr.save(obj);
                        deferred.resolve(obj);
                        spyOn(deferred.promise.$$state.value, "$save").and.callThrough();
                        $rootScope.$digest();
                    });
                    it('should update the value of the correct record', function() {
                        expect(deferred.promise.$$state.value.email).toEqual("NEWEMAIL@email.com");
                    });
                    it("should call $save before $q.when resolves", function() {
                        expect(deferred.promise.$$state.value.$save).not.toHaveBeenCalled();
                    });
                });
                describe("build() Rejected: ", function() {
                    beforeEach(function() {
                        objMngr.save(obj);
                        error = "Error!";
                        deferred.reject(error);
                        $rootScope.$digest();
                    });
                    it('should return correct error wrapped in a promise', function() {
                        expect(deferred.promise.$$state.value).toEqual(error);
                    });
                    it("should call $q.reject", function() {
                        expect($q.reject).toHaveBeenCalledWith(error);
                    });
                });
            });
            describe('remove', function() {
                beforeEach(function() {
                    spyOn(objMngr, "build").and.callFake(function() {
                        deferred = $q.defer();
                        return deferred.promise;
                    });
                    deferred.resolve(obj);
                });
                it('should call build with path', function() {
                    objMngr.remove(path);
                    expect(objMngr.build).toHaveBeenCalledWith(path);
                });
                describe("build() Resolved: ", function() {
                    //Note required cycles 
                    beforeEach(function() {
                        objMngr.remove(path);
                        deferred.resolve(obj);
                        spyOn(deferred.promise.$$state.value, "$remove").and.callThrough();
                        $rootScope.$digest(); //promise 1
                        ref.flush(); //mockfb
                        $rootScope.$digest(); //promise 2 return value
                    });
                    // it('should delete the correct record', function() {
                    // var test = objMngr.remove(path);
                    //     deferred.resolve(obj);
                    //     $rootScope.$digest(); //promise 1
                    //     ref.flush(); //mockfb
                    //     $rootScope.$digest(); //promise 2 return value
                    //     expect(test).toEqual(4);
                    // });
                    it("should call $remove with correct record", function() {
                        expect(deferred.promise.$$state.value.$remove).toHaveBeenCalled();
                    });
                });
                describe("build() Rejected: ", function() {
                    beforeEach(function() {
                        objMngr.remove(path);
                        error = "Error!";
                        deferred.reject(error);
                        $rootScope.$digest();
                    });
                    it('should return correct error wrapped in a promise', function() {
                        expect(deferred.promise.$$state.value).toEqual(error);
                    });
                    it("should call $q.reject", function() {
                        expect($q.reject).toHaveBeenCalledWith(error);
                    });
                });
            });
            describe('destroy', function() {
                beforeEach(function() {
                    spyOn(objMngr, "build").and.callFake(function() {
                        deferred = $q.defer();
                        return deferred.promise;
                    });
                });
                it('should call build with path', function() {
                    objMngr.destroy(path);
                    expect(objMngr.build).toHaveBeenCalledWith(path);
                });
                describe("build() Resolved: ", function() {
                    //Note required cycles 
                    beforeEach(function() {
                        objMngr.destroy(path);
                        deferred.resolve(obj);
                        spyOn(deferred.promise.$$state.value, "$destroy").and.callThrough();
                        $rootScope.$digest(); //promise 1
                        $rootScope.$digest(); //promise 2 return destroy
                    });
                    // it('should delete all records in the local objay', function() {
                    //     expect(deferred.promise.$$state.destroy).toEqual(0);
                    // });
                    it("should call $destroy with correct path", function() {
                        expect(deferred.promise.$$state.value.$destroy).toHaveBeenCalled();
                    });
                });
                describe("build() Rejected: ", function() {
                    beforeEach(function() {
                        objMngr.destroy(path);
                        error = "Error!";
                        deferred.reject(error);
                        $rootScope.$digest();
                    });
                    it('should return correct error wrapped in a promise', function() {
                        expect(deferred.promise.$$state.value).toEqual(error);
                    });
                    it("should call $q.reject", function() {
                        expect($q.reject).toHaveBeenCalledWith(error);
                    });
                });
            });
            describe('id', function() {
                beforeEach(function() {
                    spyOn($q, "when").and.callFake(function() {
                        deferred = $q.defer();
                        return deferred.promise;
                    });
                });
                it('should call $q.when with the firebaseobject', function() {
                    objMngr.id(obj);
                    expect($q.when).toHaveBeenCalledWith(jasmine.any(Function));
                    expect($q.when).not.toHaveBeenCalledWith(obj);
                });
                describe("build() Resolved: ", function() {
                    it('should return the correct id', function() {
                        objMngr.id(path);
                        deferred.resolve(obj);
                        $rootScope.$digest(); //promise 1
                        expect(deferred.promise.$$state.value.$id).toEqual('123');
                    });
                });
                describe("build() Rejected: ", function() {
                    beforeEach(function() {
                        objMngr.id(obj);
                        error = "Error!";
                        deferred.reject(error);
                        $rootScope.$digest();
                    });
                    it('should return correct error wrapped in a promise', function() {
                        expect(deferred.promise.$$state.value).toEqual(error);
                    });
                    it("should call $q.reject", function() {
                        expect($q.reject).toHaveBeenCalledWith(error);
                    });
                });
            });
            describe('ref', function() {
                beforeEach(function() {
                    spyOn($q, "when").and.callFake(function() {
                        deferred = $q.defer();
                        return deferred.promise;
                    });
                });
                it('should call $q.when with the firebaseobject', function() {
                    objMngr.ref(obj);
                    expect($q.when).toHaveBeenCalledWith(jasmine.any(Function));
                    expect($q.when).not.toHaveBeenCalledWith(obj);
                });
                describe("build() Resolved: ", function() {
                    it('should return the correct ref', function() {
                        objMngr.ref(path);
                        deferred.resolve(obj);
                        $rootScope.$digest(); //promise 1
                        expect(deferred.promise.$$state.value.$ref()).toEqual(ref);
                    });
                });
                describe("build() Rejected: ", function() {
                    beforeEach(function() {
                        objMngr.ref(obj);
                        error = "Error!";
                        deferred.reject(error);
                        $rootScope.$digest();
                    });
                    it('should return correct error wrapped in a promise', function() {
                        expect(deferred.promise.$$state.value).toEqual(error);
                    });
                    it("should call $q.reject", function() {
                        expect($q.reject).toHaveBeenCalledWith(error);
                    });
                });
            });
            describe('priority', function() {
                beforeEach(function() {
                    spyOn(objMngr, "build").and.callFake(function() {
                        deferred = $q.defer();
                        return deferred.promise;
                    });
                });
                it('should call build with path', function() {
                    objMngr.priority(path);
                    expect(objMngr.build).toHaveBeenCalledWith(path);
                });
                describe("build() Resolved: ", function() {
                    it('should return the correct priority', function() {
                        objMngr.priority(path);
                        deferred.resolve(obj);
                        $rootScope.$digest(); //promise 1
                        expect(deferred.promise.$$state.value.$priority).toEqual(null);
                    });
                    it('should be updateable if call $save()', function() {
                        obj.$priority = "123";
                        obj.$save
                        objMngr.priority(path);
                        deferred.resolve(obj);
                        $rootScope.$digest(); //promise 1
                        expect(deferred.promise.$$state.value.$priority).toEqual("123");
                    });
                });
                describe("build() Rejected: ", function() {
                    beforeEach(function() {
                        objMngr.priority(path);
                        error = "Error!";
                        deferred.reject(error);
                        $rootScope.$digest();
                    });
                    it('should return correct error wrapped in a promise', function() {
                        expect(deferred.promise.$$state.value).toEqual(error);
                    });
                    it("should call $q.reject", function() {
                        expect($q.reject).toHaveBeenCalledWith(error);
                    });
                });
            });
            describe('value', function() {
                beforeEach(function() {
                    spyOn(objMngr, "build").and.callFake(function() {
                        deferred = $q.defer();
                        return deferred.promise;
                    });
                });
                it('should call build with path', function() {
                    objMngr.value(path);
                    expect(objMngr.build).toHaveBeenCalledWith(path);
                });
                describe("build() Resolved: ", function() {
                    beforeEach(function() {
                        objMngr.value(path);
                        deferred.resolve(obj);
                        $rootScope.$digest(); //promise 1
                    });
                    it('should delete all records in the local objay', function() {
                        expect(deferred.promise.$$state.value).toEqual(obj);
                    });
                });
                describe("build() Rejected: ", function() {
                    beforeEach(function() {
                        objMngr.value(path);
                        error = "Error!";
                        deferred.reject(error);
                        $rootScope.$digest();
                    });
                    it('should return correct error wrapped in a promise', function() {
                        expect(deferred.promise.$$state.value).toEqual(error);
                    });
                    it("should call $q.reject", function() {
                        expect($q.reject).toHaveBeenCalledWith(error);
                    });
                });
            });
            describe('bindTo', function() {
                beforeEach(function() {
									scope = jasmine.createSpy("scope");
									varName = jasmine.createSpy("varName");
                    spyOn(objMngr, "build").and.callFake(function() {
                        deferred = $q.defer();
                        return deferred.promise;
                    });
                    deferred.resolve(obj);
                    objMngr.bindTo(path, scope, varName);
                });
                it('should call build with path', function() {
                    expect(objMngr.build).toHaveBeenCalledWith(path);
                });
                describe("build() Resolved: ", function() {
                    beforeEach(function() {
                        objMngr.bindTo(path, scope, varName);
                        deferred.resolve(obj);
                        spyOn(deferred.promise.$$state.value, "$bindTo");
                        $rootScope.$digest();
                    });
                    it('should return correct value wrapped in a promise', function() {
                        expect(deferred.promise.$$state.value).toEqual(obj);
                    });
                    it("should call $bindTo with correct record", function() {
                        expect(deferred.promise.$$state.value.$bindTo).toHaveBeenCalled();
                    });
                });
                describe("build() Rejected: ", function() {
                    beforeEach(function() {
                        objMngr.bindTo(path, scope, varName);
                        error = "Error!";
                        deferred.reject(error);
                        $rootScope.$digest();
                    });
                    it('should return correct error wrapped in a promise', function() {
                        expect(deferred.promise.$$state.value).toEqual(error);
                    });
                    it("should call $q.reject with error", function() {
                        expect($q.reject).toHaveBeenCalledWith(error);
                    });
                });
            });
            describe('loaded', function() {
                beforeEach(function() {
                    spyOn(objMngr, "build").and.callFake(function() {
                        deferred = $q.defer();
                        return deferred.promise;
                    });
                    deferred.resolve(obj);
                    objMngr.loaded(path);
                });
                it('should call build with path', function() {
                    expect(objMngr.build).toHaveBeenCalledWith(path);
                });
                describe("build() Resolved: ", function() {
                    beforeEach(function() {
                        objMngr.loaded(path);
                        deferred.resolve(obj);
                        spyOn(deferred.promise.$$state.value, "$loaded").and.callThrough();
                        $rootScope.$digest();
                    });
                    it('should return correct value wrapped in a promise', function() {
                        expect(deferred.promise.$$state.value).toEqual(obj);
                    });
                    it("should call $loaded with correct record", function() {
                        expect(deferred.promise.$$state.value.$loaded).toHaveBeenCalled();
                    });
                });
                describe("build() Rejected: ", function() {
                    beforeEach(function() {
                        objMngr.loaded(path);
                        error = "Error!";
                        deferred.reject(error);
                        $rootScope.$digest();
                    });
                    it('should return correct error wrapped in a promise', function() {
                        expect(deferred.promise.$$state.value).toEqual(error);
                    });
                    it("should call $q.reject with error", function() {
                        expect($q.reject).toHaveBeenCalledWith(error);
                    });
                });
            });

        });

        describe("Added functions", function() {
            describe("UpdateRecord", function() {
                beforeEach(function() {
                    spyOn(objMngr, "loaded").and.callFake(function() {
                        deferred = $q.defer();
                        return deferred.promise;
                    });
                    obj = mockObj.makeObject(userData, ref);
                    newData = {
                        email: "NEWEMAIL@email.com",
                        phone: '123-456-7890'
                    };
                });
                describe("Implementing build()", function() {
                    beforeEach(function() {
                        objMngr.updateRecord(path, newData);
                    });
                    it("should call loaded with path", function() {
                        expect(objMngr.loaded.calls.argsFor(0)[0]).toEqual(path);
                    });
                });
                describe("build() Resolved: ", function() {
                    beforeEach(function() {
                        spyOn(objMngr, "save");
                        objMngr.updateRecord(path, newData);
                        deferred.resolve(obj);
                        $rootScope.$digest();
                        $rootScope.$digest();
                    });

                    it("should return the correct record wrapped in a promise", function() {
                        expect(deferred.promise.$$state.value).toEqual(obj);
                    });
                    it("should call objMngr.save with updated record and path", function() {
                        expect(objMngr.save).toHaveBeenCalledWith(obj);
                        expect(deferred.promise.$$state.value.phone).toEqual("123-456-7890");
                        expect(deferred.promise.$$state.value.email).toEqual("NEWEMAIL@email.com");
                    });
                    it("should not call $q.reject", function() {
                        expect($q.reject).not.toHaveBeenCalled();
                    });
                });
                describe("build() Rejected: ", function() {
                    beforeEach(function() {
                        error = "Error!";
                        objMngr.updateRecord(path, newData);
                        deferred.reject(error);
                        $rootScope.$digest();
                    });
                    it('should return correct error wrapped in a promise', function() {
                        expect(deferred.promise.$$state.value).toEqual(error);
                    });
                    it("should call $q.reject", function() {
                        expect($q.reject).toHaveBeenCalledWith(error);
                    });
                });
            });

        });


    });
})();
