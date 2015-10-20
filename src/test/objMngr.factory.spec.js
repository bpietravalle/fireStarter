// (function() {
//     "use strict";
//     describe("objMngr", function() {
//         var objMngr, objTest, scope, varName, recId, $q, newData, userData, newObj, path, afEntity, error, mockObj, obj, deferred, ref, $rootScope;
//         var FIXTURE_DATA = {
//             aString: 'alpha',
//             aNumber: 1,
//             aBoolean: false,
//             anObject: {
//                 bString: 'bravo'
//             }
//         };

//         userData = {
//             first_name: 'billy bob',
//             email: "theemail@email.com",
//             phone: "202-202-1111",
//         };

//         beforeEach(function() {
//             module('fireStarter.services');
//             module("fbMocks");
//             recId = 123;
//             path = ["users", recId];
//             inject(function(_mockObj_, _$q_, _objMngr_, _afEntity_, _$rootScope_) {
//                 afEntity = _afEntity_;
//                 objMngr = _objMngr_;
//                 $q = _$q_;
//                 $rootScope = _$rootScope_;
//                 mockObj = _mockObj_;
//                 ref = mockObj.refWithPath(path);

//             });
//             obj = mockObj.makeObject(FIXTURE_DATA, ref);
//             spyOn($q, "when").and.callFake(function() {
//                 deferred = $q.defer();
//                 return deferred.promise;
//             });

//             spyOn(afEntity, "set").and.returnValue(obj);
//             spyOn($q, "reject");
//             objTest = objMngr(path);
//         });
//         afterEach(function() {
//             obj = null;
//             ref = null;
//             objTest = null;
//         });
//         describe("FirebaseObject API Wrapper", function() {

//             describe('Constructor', function() {
//                 it('should call $q.when 1 time', function() {
//                     expect($q.when.calls.count()).toEqual(1);
//                 });
//                 it("should call afEntity with 'object' and path", function() {
//                     expect(afEntity.set.calls.argsFor(0)[1]).toEqual(path);
//                     expect(afEntity.set.calls.argsFor(0)[0]).toEqual('object');
//                 });
//                 it('should call $q.when with correct object', function() {
//                     expect($q.when).toHaveBeenCalledWith(obj);
//                 });
//                 it('should return the correct object', function() {
//                     deferred.resolve(obj);
//                     $rootScope.$digest();
//                     expect(objTest).toEqual(jasmine.objectContaining({
//                         id: jasmine.any(Function),
//                         ref: jasmine.any(Function),
//                         priority: jasmine.any(Function),
//                         value: jasmine.any(Function),
//                         save: jasmine.any(Function),
//                         remove: jasmine.any(Function),
//                         destroy: jasmine.any(Function),
//                         bindTo: jasmine.any(Function),
//                         loaded: jasmine.any(Function)
//                     }));

//                 });

//                 it('should return correct value wrapped in a promise', function() {
//                     deferred.resolve(obj);
//                     $rootScope.$digest();
//                     expect(deferred.promise.$$state.value).toEqual(obj);
//                 });
//             });
//         });
//         describe('save', function() {
//             beforeEach(function() {
//                 spyOn(obj, "$save").and.callThrough();
//             });
//             it('should call $save with the firebaseobject', function() {
//                 objTest.save();
//                 deferred.resolve(obj);
//                 $rootScope.$digest();
//                 expect(obj.$save).toHaveBeenCalled();
//             });
//             describe("build() Resolved: ", function() {
//                 beforeEach(function() {
//                     objTest.save();
//                     deferred.resolve(obj);
//                     obj.email = "NEWEMAIL@email.com";
//                     $rootScope.$digest();
//                     ref.flush();
//                 });
//                 it('should update the value of the correct record', function() {
//                     expect(obj.email).toEqual("NEWEMAIL@email.com");
//                 });
//                 it("should not call $q.reject", function() {
//                     expect($q.reject).not.toHaveBeenCalled();
//                 });
//             });
//             describe("build() Rejected: ", function() {
//                 beforeEach(function() {
//                     objTest.save();
//                     error = "Error!";
//                     deferred.reject(error);
//                     $rootScope.$digest();
//                 });
//                 it("should call $q.reject", function() {
//                     expect($q.reject).toHaveBeenCalledWith(error);
//                 });
//             });
//         });
//         describe('remove', function() {
//             beforeEach(function() {
//                 spyOn(obj, "$remove").and.callThrough();
//                 objTest.remove();
//                 deferred.resolve(obj);
//                 $rootScope.$digest(); //promise 1
//                 ref.flush();
//             });
//             it('should call $remove', function() {
//                 expect(obj.$remove).toHaveBeenCalled();
//             });
//             it('should delete the correct record', function() {
//                 expect(obj).not.toBe();
//             });
//             it("should not call $q.reject", function() {
//                 expect($q.reject).not.toHaveBeenCalled();
//             });
//         });
//         describe('destroy', function() {
//             beforeEach(function() {
//                 spyOn(obj, "$destroy").and.callThrough();;
//                 objTest.destroy();
//                 deferred.resolve(obj);
//                 $rootScope.$digest(); //promise 1
//             });
//             it('should call build with path', function() {
//                 expect(obj.$destroy).toHaveBeenCalled();
//             });
//         });
//         describe('id', function() {
//             it('should return the correct id', function() {
//                 objTest.id();
//                 deferred.resolve(obj);
//                 $rootScope.$digest(); //promise 1
//                 expect(deferred.promise.$$state.value.$id).toEqual('123');
//             });
//         });
//         describe('ref', function() {
//             it('should return the correct ref', function() {
//                 objTest.ref();
//                 deferred.resolve(obj);
//                 $rootScope.$digest(); //promise 1
//                 expect(deferred.promise.$$state.value.$ref()).toEqual(ref);
//             });
//         });
//         describe('priority', function() {
//             it('should return the correct priority', function() {
//                 objTest.priority();
//                 deferred.resolve(obj);
//                 $rootScope.$digest(); //promise 1
//                 expect(deferred.promise.$$state.value.$priority).toEqual(null);
//             });
//             it('should be updateable if call $save()', function() {
//                 obj.$priority = "123";
//                 obj.$save
//                 objTest.priority(path);
//                 deferred.resolve(obj);
//                 $rootScope.$digest(); //promise 1
//                 expect(deferred.promise.$$state.value.$priority).toEqual("123");
//             });
//         });
//         describe('value', function() {
//             //TODO fix test
//             beforeEach(function() {
//                 objTest.value();
//                 deferred.resolve(obj);
//                 $rootScope.$digest(); //promise 1
//             });
//             it('should return the correct value', function() {
//                 expect(deferred.promise.$$state.value).toEqual(obj);
//             });
//             it('should', function() {

//             });
//         });
//         describe('bindTo', function() {
//             beforeEach(function() {
//                 spyOn(obj, "$bindTo");
//                 scope = jasmine.createSpy("scope");
//                 varName = jasmine.createSpy("varName");
//                 objTest.bindTo(scope, varName);
//                 deferred.resolve(obj);
//                 $rootScope.$digest();
//             });
//             it("should call $bindTo with correct record", function() {
//                 expect(obj.$bindTo).toHaveBeenCalledWith(scope, varName);
//             });
//         });
//         describe('loaded', function() {
//             beforeEach(function() {
//                 spyOn(obj, "$loaded");
//                 objTest.loaded();
//                 deferred.resolve(obj);
//                 $rootScope.$digest();
//             });
//             it("should call $loaded with correct record", function() {
//                 expect(obj.$loaded).toHaveBeenCalled();
//             });
//         });

//     });
// })();
