// (function() {
//     "use strict";
//     describe('arrMngr', function() {
//         var arr, arrTest, baseBuilder, error, path, fkey, col, mockRecord, recId, data, $log, $q, deferred1, deferred, $rootScope, newData, newArr, ref, mockArr, arrMngr;

//         var STUB_DATA = {
//             'a': {
//                 aString: 'alpha',
//                 aNumber: 1,
//                 aBoolean: false
//             },
//             'b': {
//                 aString: 'bravo',
//                 aNumber: 2,
//                 aBoolean: true
//             },
//             'c': {
//                 aString: 'charlie',
//                 aNumber: 3,
//                 aBoolean: true
//             },
//             'd': {
//                 aString: 'delta',
//                 aNumber: 4,
//                 aBoolean: true
//             },
//             'e': {
//                 aString: 'echo',
//                 aNumber: 5
//             }
//         };

//         newData = {

//             aString: 'hello',
//             aNumber: 6
//         };

//         beforeEach(function() {
//             module('fireStarter.services');
//             module('fbMocks');
//             module('testutils');
//             path = ["users", "1", "phones"];
//             inject(function(_$log_, _$q_, _baseBuilder_, _$rootScope_, _arrMngr_, _mockArr_) {
//                 baseBuilder = _baseBuilder_;
//                 $q = _$q_;
//                 $rootScope = _$rootScope_;
//                 $log = _$log_;
//                 arrMngr = _arrMngr_;
//                 mockArr = _mockArr_;
//                 ref = mockArr.refWithPath(path);
//             });
//             arr = mockArr.stubArray(STUB_DATA, ref);
//             mockRecord = mockArr.mockRecord(arr, recId);
//             spyOn(baseBuilder, "set").and.returnValue(arr);
//             spyOn($q, "when").and.callFake(function() {
//                 deferred = $q.defer();
//                 return deferred.promise;
//             });
//             arrTest = arrMngr(path);
//             recId = 'a';
//             spyOn($q, "reject");
//         });
//         afterEach(function() {
//             arr = null;
//             ref = null;
//             arrTest = null;
//         });

//         describe('Constructor', function() {
//             it("should call baseBuilder with path", function() {
//                 expect(baseBuilder.set.calls.argsFor(0)[1]).toEqual(path);
//                 expect(baseBuilder.set.calls.argsFor(0)[0]).toEqual("array");
//             });
//             it('should call $q.when with correct array', function() {
//                 expect($q.when).toHaveBeenCalledWith(arr);
//             });
//             it('should return a firebaseArray', function() {
//                 deferred.resolve(arr);
//                 $rootScope.$digest();
//                 expect(arrTest).toEqual(jasmine.objectContaining({
//                     add: jasmine.any(Function),
//                     destroy: jasmine.any(Function),
//                     getRecord: jasmine.any(Function),
//                     indexFor: jasmine.any(Function),
//                     keyAt: jasmine.any(Function),
//                     loaded: jasmine.any(Function),
//                     ref: jasmine.any(Function),
//                     remove: jasmine.any(Function),
//                     save: jasmine.any(Function)
//                 }));
//             });
//             describe("When Rejected: ", function() {
//                 beforeEach(function() {
//                     arrTest.add("as");
//                     error = "Error!";
//                     deferred.reject(error);
//                     $rootScope.$digest();
//                 });
//                 it("should call $q.reject", function() {
//                     expect($q.reject).toHaveBeenCalledWith(error);
//                 });
//             });
//         });
//         describe('keyAt', function() {
//             beforeEach(function() {
//                 spyOn(arr, "$keyAt").and.callThrough();
//                 arrTest.keyAt(mockRecord);
//                 deferred.resolve(arr);
//                 $rootScope.$digest();
//             });
//             it("should call $keyAt with correct record", function() {
//                 expect(arr.$keyAt).toHaveBeenCalledWith(mockRecord);
//             });
//             it('should return correct key', function() {
//                 var testKey = arrTest.keyAt(mockRecord)
//                 deferred.resolve(arr);
//                 $rootScope.$digest();
//                 $rootScope.$digest();
//                 expect(testKey.$$state.value).toEqual(recId);
//             });
//         });
//         describe('ref', function() {
//             beforeEach(function() {
//                 spyOn(arr, "$ref").and.callThrough();
//                 arrTest.ref()
//                 deferred.resolve(arr);
//                 $rootScope.$digest();
//             });
//             it("should call $ref()", function() {
//                 expect(arr.$ref).toHaveBeenCalled();
//             });
//             it('should return correct value wrapped in a promise', function() {
//                 var testRef = arrTest.ref();
//                 deferred.resolve(arr);
//                 $rootScope.$digest();
//                 expect(testRef.$$state.value).toEqual(ref);
//             });
//         });
//         describe('loaded', function() {
//             beforeEach(function() {
//                 spyOn(arr, "$loaded").and.callThrough();
//                 arrTest.loaded();
//                 recId = 'a';
//                 deferred.resolve(arr);
//                 $rootScope.$digest();
//             });
//             it("should call $loaded with correct record", function() {
//                 expect(arr.$loaded).toHaveBeenCalled();
//             });
//         });
//         describe('save', function() {
//             beforeEach(function() {
//                 spyOn(arr, "$save");
//                 arrTest.save(mockRecord);
//                 deferred.resolve(arr);
//                 $rootScope.$digest();
//                 $rootScope.$digest();
//             });
//             it('should call $save with array and record', function() {
//                 expect(arr.$save).toHaveBeenCalledWith(mockRecord);
//             });
//             it("should not call $q.reject", function() {
//                 expect($q.reject).not.toHaveBeenCalled();
//             });
//             it('should update the values', function() {
//                 mockRecord.aNumber = newData.aNumber;
//                 mockRecord.aString = newData.aString;
//                 arrTest.save(mockRecord);
//                 $rootScope.$digest();
//                 // ref.flush();
//                 expect(mockRecord.aNumber).toEqual(newData.aNumber);
//                 expect(mockRecord.aString).toEqual(newData.aString);
//             });
//         });
//         describe('remove', function() {
//             beforeEach(function() {
//                 spyOn(arr, "$remove");
//                 arrTest.remove(mockRecord);
//                 deferred.resolve(arr);
//                 $rootScope.$digest();
//             });
//             it('should call $remove with array and record', function() {
//                 expect(arr.$remove).toHaveBeenCalledWith(mockRecord);
//             });
//             it('should delete the correct record', function() {
//                 expect(mockRecord).not.toBe();
//             });
//             it("should not call $q.reject", function() {
//                 expect($q.reject).not.toHaveBeenCalled();
//             });

//         });
//         describe('destroy', function() {
//             beforeEach(function() {
//                 spyOn(arr, "$destroy").and.callThrough();
//                 arrTest.destroy();
//                 deferred.resolve(arr);
//                 $rootScope.$digest();
//                 $rootScope.$digest(); //promise 1
//                 $rootScope.$digest(); //promise 2 return value
//             });
//             it('should delete all records in the local array', function() {
//                 expect(arr.length).toEqual(0);
//             });
//             it("should call $destroy", function() {
//                 expect(arr.$destroy).toHaveBeenCalled();
//             });
//         });
//         describe('getRecord', function() {
//             beforeEach(function() {
//                 spyOn(arr, "$getRecord").and.callThrough();
//                 arrTest.getRecord(recId);
//                 deferred.resolve(arr);
//                 $rootScope.$digest(); //promise 1

//             });
//             it('should call $getRecord with key', function() {
//                 expect(arr.$getRecord).toHaveBeenCalledWith(recId);
//             });
//             it('should return the correct array', function() {
//                 expect(deferred.promise.$$state.value).toEqual(arr);
//             });
//             it('should return object with correct record', function() {
//                 expect(deferred.promise.$$state.value[0]).toEqual(jasmine.objectContaining({

//                     $id: 'a',
//                     aString: 'alpha',
//                     aNumber: 1,
//                     aBoolean: false
//                 }));
//             });
//         });
//         describe('indexFor', function() {
//             beforeEach(function() {
//                 spyOn(arr, "$indexFor");
//                 arrTest.indexFor(recId);
//                 deferred.resolve(arr);
//                 $rootScope.$digest(); //promise 1
//             });
//             it('should call $indexFor with key', function() {
//                 expect(arr.$indexFor).toHaveBeenCalledWith(recId);
//             });
//         });
//         describe('add', function() {
//             beforeEach(function() {
//                 spyOn(arr, "$add").and.callThrough();
//                 arrTest.add(newData);
// 								deferred.resolve(arr);
//                 $rootScope.$digest(); 
//                 ref.flush();
// 								deferred.resolve(arr);
//                 $rootScope.$digest(); 
//                 $rootScope.$digest(); 
//             });
//             it('should call $add with the new record', function() {
//                 expect(arr.$add).toHaveBeenCalledWith(newData);
//             });
//             it('should add a new record to the array', function() {
//                 expect(arr.length).toEqual(6);
//             });
// 						it('should not call $q.reject()',function(){
// 							expect($q.reject).not.toHaveBeenCalled();
// 						});
//         });

//     });
// })();
