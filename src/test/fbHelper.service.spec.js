(function() {
    "use strict";
    describe("fbHelper", function() {
        var fbHelper, objTest, scope, varName, recId, $q, newData, userData, newObj, path, afEntity, error, mockObj, obj, deferred, ref, $rootScope;
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
            module('fireStarter.services');
            module("fbMocks");
            recId = 123;
            path = ["users", recId];
            inject(function(_mockObj_, _$q_, _fbHelper_, _afEntity_, _$rootScope_) {
                afEntity = _afEntity_;
                fbHelper = _fbHelper_;
                $q = _$q_;
                $rootScope = _$rootScope_;
                mockObj = _mockObj_;
                ref = mockObj.refWithPath(path);

            });
            obj = mockObj.makeObject(FIXTURE_DATA, ref);
            spyOn($q, "when").and.callFake(function() {
                deferred = $q.defer();
                return deferred.promise;
            });

            spyOn(afEntity, "set").and.returnValue(obj);
            spyOn($q, "reject");
            objTest = fbHelper(path);
        });
        afterEach(function() {
            obj = null;
            ref = null;
            objTest = null;
        });
        // describe("build() Rejected: ", function() {
        //     beforeEach(function() {
        //         fbHelper.loaded();
        //         error = "Error!";
        //         deferred.reject(error);
        //         $rootScope.$digest();
        //     });
        //     it('should return correct error wrapped in a promise', function() {
        //         expect(deferred.promise.$$state.value).toEqual(error);
        //     });
        //     it("should call $q.reject with error", function() {
        //         expect($q.reject).toHaveBeenCalledWith(error);
        //     });
        // });
        // });


        // describe("Added functions", function() {
        //     describe("UpdateRecord", function() {
        //         beforeEach(function() {
        //             spyOn(fbHelper, "loaded").and.callFake(function() {
        //                 deferred = $q.defer();
        //                 return deferred.promise;
        //             });
        //             obj = mockObj.makeObject(userData, ref);
        //             newData = {
        //                 email: "NEWEMAIL@email.com",
        //                 phone: '123-456-7890'
        //             };
        //         });
        // describe("Implementing build()", function() {
        //     beforeEach(function() {
        //         fbHelper.updateRecord(path, newData);
        //     });
        //     it("should call loaded with path", function() {
        //         expect(fbHelper.loaded.calls.argsFor(0)[0]).toEqual(path);
        //     });
        // });
        // describe("build() Resolved: ", function() {
        //     beforeEach(function() {
        //         spyOn(fbHelper, "save");
        //         fbHelper.updateRecord(path, newData);
        //         deferred.resolve(obj);
        //         $rootScope.$digest();
        //         $rootScope.$digest();
        //     });

        //     it("should return the correct record wrapped in a promise", function() {
        //         expect(deferred.promise.$$state.value).toEqual(obj);
        //     });
        //     it("should call fbHelper.save with updated record and path", function() {
        //         expect(fbHelper.save).toHaveBeenCalledWith(obj);
        //         expect(deferred.promise.$$state.value.phone).toEqual("123-456-7890");
        //         expect(deferred.promise.$$state.value.email).toEqual("NEWEMAIL@email.com");
        //     });
        //     it("should not call $q.reject", function() {
        //         expect($q.reject).not.toHaveBeenCalled();
        //     });
        // });
        // describe("build() Rejected: ", function() {
        //     beforeEach(function() {
        //         error = "Error!";
        //         fbHelper.updateRecord(path, newData);
        //         deferred.reject(error);
        //         $rootScope.$digest();
        //     });
        //     it('should return correct error wrapped in a promise', function() {
        //         expect(deferred.promise.$$state.value).toEqual(error);
        //     });
        //     it("should call $q.reject", function() {
        //         expect($q.reject).toHaveBeenCalledWith(error);
        //     });
        // });
        // });

        // });

				/*
				 *
				 * arrMngr tests
				 */
        // describe("Added functions", function() {
        //     describe("GetNestedKey", function() {
        //         beforeEach(function() {
        //             spyOn($q, "reject")
        //             spyOn(arrMngr, "build").and.callFake(function() {
        //                 deferred = $q.defer();
        //                 return deferred.promise;
        //             });
        //             data = {
        //                 'a': {
        //                     type: "cell",
        //                     number: "1234567",
        //                     phone_id: "fkeyA"
        //                 },
        //                 'b': {
        //                     type: "work",
        //                     number: "9871234",
        //                     phone_id: "fkeyB"
        //                 },
        //                 'c': {
        //                     type: "home",
        //                     number: "0000000",
        //                     phone_id: "fkeyC"
        //                 }
        //             };
        //             arr = mockArr.stubArray(data, ref);
        //         });
        //         describe("build() Resolved: ", function() {
        //             it("should return a promise", function() {
        //                 var test = arrMngr.getNestedKey("fkeyA", "phone_id", path);
        //                 deferred.resolve(arr);
        //                 $rootScope.$digest();
        //                 expect(test).toBeAPromise();
        //             });
        //             it("should set the correct nestedKey", function() {
        //                 var test = arrMngr.getNestedKey("fkeyB", "phone_id", path);
        //                 deferred.resolve(arr);
        //                 $rootScope.$digest();
        //                 expect(test.$$state.value).toEqual('b');
        //             });
        //             it("should throw an error if no key/val pair found", function() {
        //                 expect(function() {
        //                     arrMngr.getNestedKey("fkeyA", "address_id", path);
        //                     deferred.resolve(arr);
        //                     $rootScope.$digest();
        //                 }).toThrow();
        //             });
        //             it("should not call $q.reject", function() {
        //                 expect($q.reject).not.toHaveBeenCalled();
        //             });

        //         });
        //         describe("build() Rejected: ", function() {
        //             beforeEach(function() {
        //                 error = "Error!";
        //                 arrMngr.getNestedKey("fkeyA", "phone_id", path);
        //                 deferred.reject(error);
        //                 $rootScope.$digest();
        //             });
        //             it('should return correct error wrapped in a promise', function() {
        //                 expect(deferred.promise.$$state.value).toEqual(error);
        //             });
        //             it("should call $q.reject", function() {
        //                 expect($q.reject).toHaveBeenCalledWith(error);
        //             });
        //         });

        //     });
        //     // describe("UpdateRecord", function() {
        //     //     beforeEach(function() {
        //     //         spyOn($q, "reject")
        //     //         spyOn(arrMngr, "getRecord").and.callFake(function() {
        //     //             deferred = $q.defer();
        //     //             return deferred.promise;
        //     //         });
        //     //         data = {
        //     //             'a': {
        //     //                 type: "cell",
        //     //                 number: "1234567",
        //     //                 phone_id: "fkeyA"
        //     //             },
        //     //             'b': {
        //     //                 type: "work",
        //     //                 number: "9871234",
        //     //                 phone_id: "fkeyB"
        //     //             },
        //     //             'c': {
        //     //                 type: "home",
        //     //                 number: "0000000",
        //     //                 phone_id: "fkeyC"
        //     //             }
        //     //         };
        //     //         recId = 'a';
        //     //         arr = mockArr.stubArray(data, ref);
        //     //         mockRecord = mockArr.mockRecord(arr, recId);
        //     //         newData = {
        //     //             aNumber: 5,
        //     //             aString: 'gamma'
        //     //         };
        //     //     });
        //     // describe("build() Resolved: ", function() {
        //     //     beforeEach(function() {
        //     //         spyOn(arrMngr, "save").and.callThrough();
        //     //         arrMngr.updateRecord(arr, mockRecord, newData);
        //     //         deferred.resolve(mockRecord);
        //     //         $rootScope.$digest();
        //     //         $rootScope.$digest();
        //     //     });

        //     //     it("should return the correct record wrapped in a promise", function() {
        //     //         expect(deferred.promise.$$state.value).toEqual(mockRecord);
        //     //     });
        //     //     it("should call arrMngr.save with updated record and path", function() {
        //     //         expect(arrMngr.save).toHaveBeenCalledWith(arr, mockRecord);
        //     //         expect(arrMngr.save.calls.argsFor(0)[1].aString).toEqual("gamma");
        //     //         expect(arrMngr.save.calls.argsFor(0)[1].aNumber).toEqual(5);
        //     //     });
        //     //     it("should not call $q.reject", function() {
        //     //         expect($q.reject).not.toHaveBeenCalled();
        //     //     });
        //     // });
        //     // describe("build() Rejected: ", function() {
        //     //     beforeEach(function() {
        //     //         error = "Error!";
        //     //         arrMngr.updateRecord(arr, mockRecord, newData);
        //     //         deferred.reject(error);
        //     //         $rootScope.$digest();
        //     //     });
        //     //     it('should return correct error wrapped in a promise', function() {
        //     //         expect(deferred.promise.$$state.value).toEqual(error);
        //     //     });
        //     //     it("should call $q.reject", function() {
        //     //         expect($q.reject).toHaveBeenCalledWith(error);
        //     //     });
        //     // });



        //     // });
        //     describe("updateNestedArray", function() {
        //         beforeEach(function() {
        //             spyOn($q, "reject")
        //             spyOn(arrMngr, "getNestedKey").and.callFake(function() {
        //                 deferred = $q.defer();
        //                 return deferred.promise;
        //             });
        //             spyOn(arrMngr, "updateRecord").and.callFake(function() {
        //                 deferred1 = $q.defer();
        //                 return deferred.promise;
        //             });
        //             data = {
        //                 'a': {
        //                     type: "cell",
        //                     number: "1234567",
        //                     phone_id: "fkeyA"
        //                 },
        //                 'b': {
        //                     type: "work",
        //                     number: "9871234",
        //                     phone_id: "fkeyB"
        //                 },
        //                 'c': {
        //                     type: "home",
        //                     number: "0000000",
        //                     phone_id: "fkeyC"
        //                 }
        //             };
        //             fkey = "fkeyA";
        //             col = "phone_id";
        //             recId = 'a';
        //             arr = mockArr.stubArray(data, ref);
        //             mockRecord = mockArr.mockRecord(arr, recId);
        //             newData = {
        //                 number: "202-202-1111",
        //                 type: 'fax'
        //             };
        //         });
        //         describe("build() Resolved: ", function() {
        //             beforeEach(function() {
        //                 arrMngr.updateNestedArray(fkey, col, path, newData);
        //                 deferred.resolve(recId);
        //                 $rootScope.$digest();
        //                 deferred1.resolve(ref);
        //                 $rootScope.$digest();
        //                 $rootScope.$digest();
        //             });

        //             it("should return the correct Id wrapped in a promise", function() {
        //                 expect(deferred.promise.$$state.value).toEqual(recId);
        //             });
        //             it("should call getNestedKey with path and and fkey value and column", function() {
        //                 expect(arrMngr.getNestedKey.calls.argsFor(0)[0]).toEqual("fkeyA");
        //                 expect(arrMngr.getNestedKey.calls.argsFor(0)[1]).toEqual("phone_id");
        //                 expect(arrMngr.getNestedKey.calls.argsFor(0)[2]).toEqual(path);
        //             });
        //             it("should call arrMngr.updateRecord with path correct recId and data", function() {
        //                 expect(arrMngr.updateRecord.calls.argsFor(0)[0]).toEqual(path);
        //                 expect(arrMngr.updateRecord.calls.argsFor(0)[1]).toEqual(recId);
        //                 expect(arrMngr.updateRecord.calls.argsFor(0)[2]).toEqual(newData);
        //             });
        //             it("should not call $q.reject", function() {
        //                 expect($q.reject).not.toHaveBeenCalled();
        //             });
        //         });
        //         describe("build() Rejected: ", function() {
        //             beforeEach(function() {
        //                 error = "Error!";
        //                 arrMngr.updateNestedArray(fkey, col, path, newData);
        //                 deferred.reject(error);
        //                 $rootScope.$digest();
        //             });
        //             it('should return correct error wrapped in a promise', function() {
        //                 expect(deferred.promise.$$state.value).toEqual(error);
        //             });
        //             it("should call $q.reject", function() {
        //                 expect($q.reject).toHaveBeenCalledWith(error);
        //             });
        //         });



        //     });




        // });

    });
})();
