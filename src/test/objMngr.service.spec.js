(function() {
    "use strict";
    describe("objMngr", function() {
        var objMngr, $q, newData, newObj, path, afEntity, error, mockObj, obj, fbHandler, deferred, ref, log, $interval, $timeout, $utils, testutils, $rootScope;
        var FIXTURE_DATA = {
            aString: 'alpha',
            aNumber: 1,
            aBoolean: false,
            anObject: {
                bString: 'bravo'
            }
        };


        beforeEach(function() {
            module('fb.srvc.dataMngr');
            module("fbMocks");
            module('testutils', function($provide) {
                $provide.value('$log', {
                    error: function() {
                        log.error.push(Array.prototype.slice.call(arguments));
                    }
                });
            });
            path = ["users"];
            inject(function(_mockObj_, _$q_, _objMngr_, _afEntity_, _fbHandler_, _$timeout_, _$interval_, _testutils_, $firebaseUtils, _$rootScope_) {
                afEntity = _afEntity_;
                objMngr = _objMngr_;
                $q = _$q_;
                $utils = $firebaseUtils;
                testutils = _testutils_;
                $rootScope = _$rootScope_;
                $timeout = _$timeout_;
                $interval = _$interval_;
                fbHandler = _fbHandler_;
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

            describe('create', function() {
                beforeEach(function() {
                    spyOn($q, "reject");
                    spyOn(obj, "build").and.callFake(function() {
                        deferred = $q.defer();
                        return deferred.promise;
                    });
                });
                it('should call build with path', function() {
                    objMngr.create(path, newData);
                    expect(obj.build).toHaveBeenCalledWith(path);
                });
                describe("build() Resolved: ", function() {
                    beforeEach(function() {
                        objMngr.create(path, newData);
                        deferred.resolve(obj);
                        spyOn(deferred.promise.$$state.value, "$create").and.callThrough();
                        $rootScope.$digest(); //promise 1
                        ref.flush();
                        $rootScope.$digest();
                    });
                    it('should call $create with the new record', function() {
                        expect(deferred.promise.$$state.value.$create).toHaveBeenCalledWith(newData);
                    });
                    it('should create a new record to the object', function() {
                        expect(deferred.promise.$$state.value.length).toEqual(6);
                    });
                });
                describe("build() Rejected: ", function() {
                    beforeEach(function() {
                        objMngr.create(path, newData);
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










        describe("Added functions", function() {});

        //         describe("UpdateRecord", function() {
        //             beforeEach(function() {
        //                 newData = {
        //                     aNumber: 5,
        //                     aString: 'gamma'
        //                 };
        //                 spyOn($q, "reject").and.callThrough();
        //                 spyOn(objMngr, "save").and.callThrough();
        //             });
        //             describe("Implementing $q.when", function() {
        //                 beforeEach(function() {
        //                     spyOn($q, "when").and.callThrough();
        //                 });

        //                 it("should call $q.when with only one arg", function() {
        //                     objMngr.updateRecord(obj, newData);
        //                     expect($q.when.calls.count()).toEqual(1);
        //                 });
        //                 it("should be called with updated record", function() {
        //                     objMngr.updateRecord(obj, newData);
        //                     expect($q.when.calls.argsFor(0)).not.toEqual(obj);
        //                 });
        //             });

        //             describe("Stubbing $q.when", function() {
        //                 beforeEach(function() {
        //                     newObj = mockObj.makeObject(newData, ref);
        //                     spyOn($q, "when").and.callFake(function() {
        //                         deferred = $q.defer();
        //                         return deferred.promise;
        //                     });
        //                 });
        //                 describe("When $q.when resolves", function() {
        //                     beforeEach(function() {
        //                         objMngr.updateRecord(obj, newData);
        //                         deferred.resolve(newObj);
        //                         $rootScope.$digest();
        //                     });
        //                     it("should call save with the updated record", function() {
        //                         expect(objMngr.save).toHaveBeenCalledWith(newObj);
        //                     });
        //                 });
        //                 describe("When $q.when is rejected", function() {
        //                     beforeEach(function() {
        //                         objMngr.updateRecord(obj, newData);
        //                         deferred.reject("error");
        //                         $rootScope.$digest();
        //                     });
        //                     it("should not call save with the updated record", function() {
        //                         expect(objMngr.save).not.toHaveBeenCalledWith(newObj);
        //                     });
        //                     it("should call $q.reject with the error", function() {
        //                         expect($q.reject).toHaveBeenCalledWith("error");
        //                     });

        //                 });
        //             });

        //         });

        //         describe('create', function() {
        //             beforeEach(function() {
        //                 spyOn(fbHandler, "handler").and.callThrough();
        //             });
        //             it("should call fbHandler.handler", function() {
        //                 objMngr.create(ref, FIXTURE_DATA);
        //                 expect(fbHandler.handler).toHaveBeenCalledWith(jasmine.any(Function));
        //             });
        //             it("should return a promise", function() {
        //                 var test = objMngr.create(ref, FIXTURE_DATA);
        //                 expect(test).toBeAPromise();
        //             });
        //         });

        //         describe('value', function() {
        //             it('should return the correct value', function() {
        //                 var obj = mockObj.makeObject('a string', ref);
        //                 var test = objMngr.value(obj);
        //                 expect(test).toEqual('a string');
        //             });
        //             it('should be able to set with save()', function() {
        //                 objMngr.value(obj, 10);
        //                 obj.$save();
        //                 ref.flush();
        //                 expect(obj.$value).toEqual(10);
        //             });
        //         });
        //         describe('priority', function() {
        //             it('should return the correct priority', function() {
        //                 var test = objMngr.priority(obj);
        //                 expect(test).toEqual(null);
        //             });
        //             it('should be able to set with save()', function() {
        //                 objMngr.priority(obj, 10);
        //                 obj.$save();
        //                 ref.flush();
        //                 expect(obj.$priority).toEqual(10);
        //             });
        //         });
        //         describe('id', function() {
        //             it('should be equal to $ref().key()', function() {
        //                 expect(objMngr.id(obj)).toEqual(obj.$ref().key());
        //             });
        //         });
        //         describe('ref', function() {
        //             it('should return the Firebase instance that created it', function() {
        //                 expect(objMngr.ref(obj)).toBe(ref);
        //             });
        //         });
        //         describe('load', function() {
        //             beforeEach(function() {
        //                 this.good = jasmine.createSpy('resolve');
        //                 this.bad = jasmine.createSpy('reject');
        //             });
        //             it('should return a resolved promise', function() {
        //                 var test = objMngr.load(obj);
        //                 expect(test).toBeAPromise();
        //                 expect(test.$$state.status).toEqual(1);
        //             });
        //             it('should resolve when all data is received', function() {
        //                 var res = {
        //                     success: this.good,
        //                     failure: this.bad
        //                 };
        //                 objMngr.load(obj, res);
        //                 // works without the line below; not sure why
        //                 // obj.$ref().flush();
        //                 flushAll();
        //                 expect(this.good).toHaveBeenCalledWith(obj);
        //                 expect(this.bad).not.toHaveBeenCalled();
        //             });
        //             it("should reject if the promise is rejected", function() {
        //                 var err = new Error("ERROR!!!");
        //                 ref.failNext('once', err);
        //                 var obj = mockObj.makeObject(null, ref);
        //                 var res = {
        //                     success: this.good,
        //                     failure: this.bad
        //                 };
        //                 objMngr.load(obj, res);
        //                 flushAll();
        //                 expect(this.good).not.toHaveBeenCalled();
        //                 expect(this.bad).toHaveBeenCalledWith(err);
        //             });
        //             it("resolves to the firebaseObject instance", function() {
        //                 var spy = jasmine.createSpy('loaded');
        //                 objMngr.load(obj).then(spy);
        //                 flushAll();
        //                 expect(spy).toHaveBeenCalledWith(obj);
        //             });
        //             it('should contain all data at the time $loaded is called', function() {
        //                 var obj = mockObj.makeObject();
        //                 var spy = jasmine.createSpy('loaded').and.callFake(function(data) {
        //                     expect(data).toEqual(jasmine.objectContaining(FIXTURE_DATA));
        //                 });
        //                 var result = {
        //                     success: spy,
        //                     failure: null
        //                 };
        //                 objMngr.load(obj, result);
        //                 obj.$ref().set(FIXTURE_DATA);
        //                 flushAll(obj.$ref());
        //                 expect(spy).toHaveBeenCalled();
        //             });
        //             it('should trigger if attached after load completes', function() {
        //                 var obj = mockObj.makeObject();
        //                 var spy = jasmine.createSpy('$loaded');
        //                 obj.$ref().flush();
        //                 var result = {
        //                     success: spy,
        //                     failure: null
        //                 };
        //                 objMngr.load(obj, result);
        //                 flushAll();
        //                 expect(spy).toHaveBeenCalled();
        //             });
        //             it('should trigger if attached before load completes', function() {
        //                 var obj = mockObj.makeObject();
        //                 var spy = jasmine.createSpy('$loaded');
        //                 var result = {
        //                     success: spy,
        //                     failure: null
        //                 };

        //                 objMngr.load(obj, result);
        //                 expect(spy).not.toHaveBeenCalled();
        //                 flushAll(obj.$ref());
        //                 expect(spy).toHaveBeenCalled();
        //             });

        //             it('should resolve properly if function passed directly into $loaded', function() {
        //                 var spy = jasmine.createSpy('loaded');
        //                 var result = {
        //                     success: spy,
        //                     failure: null
        //                 };
        //                 objMngr.load(obj, result);
        //                 flushAll();
        //                 expect(spy).toHaveBeenCalledWith(obj);
        //             });
        //             it('should reject properly if function passed directly into $loaded', function() {
        //                 var err = new Error('test_fail');
        //                 ref.failNext('once', err);
        //                 var obj = mockObj.makeObject(undefined, ref);
        //                 var result = {
        //                     success: this.good,
        //                     failure: this.bad
        //                 };
        //                 objMngr.load(obj, result);
        //                 ref.flush();
        //                 $timeout.flush();
        //                 expect(this.good).not.toHaveBeenCalled();
        //                 expect(this.bad).toHaveBeenCalledWith(err);
        //             });
        //         });
        //         describe('save', function() {
        //             beforeEach(function() {
        //                 this.good = jasmine.createSpy('resolve');
        //                 this.bad = jasmine.createSpy('reject');
        //             });
        //             it('should call $firebase.$set', function() {
        //                 spyOn(obj.$ref(), 'set');
        //                 obj.foo = 'bar';
        //                 objMngr.save(obj);
        //                 expect(obj.$ref().set).toHaveBeenCalled();
        //             });

        //             it('should return a promise', function() {
        //                 var test = objMngr.save(obj);
        //                 expect(test).toBeAPromise();
        //             });

        //             it('should resolve promise to the ref for this object when passed result obj', function() {
        //                 var res = {
        //                     success: this.good,
        //                     failure: this.bad
        //                 };
        //                 objMngr.save(obj, res);
        //                 // test.then(this.good, this.bad);
        //                 expect(this.good).not.toHaveBeenCalled();
        //                 flushAll();
        //                 expect(this.good).toHaveBeenCalled();
        //                 expect(this.bad).not.toHaveBeenCalled();
        //             });

        //             it('should reject promise on failure when passed result obj', function() {
        //                 var err = new Error('test_fail');
        //                 obj.$ref().failNext('set', err);
        //                 var res = {
        //                     success: this.good,
        //                     failure: this.bad
        //                 };
        //                 objMngr.save(obj, res);
        //                 expect(this.bad).not.toHaveBeenCalled();
        //                 flushAll();
        //                 expect(this.good).not.toHaveBeenCalled();
        //                 expect(this.bad).toHaveBeenCalledWith(err);
        //             });

        //             it('should trigger watch event', function() {
        //                 var spy = jasmine.createSpy('$watch');
        //                 obj.$watch(spy);
        //                 obj.foo = 'watchtest';
        //                 objMngr.save(obj);
        //                 flushAll();
        //                 expect(spy).toHaveBeenCalledWith(jasmine.objectContaining({
        //                     event: 'value',
        //                     key: obj.$id
        //                 }));
        //             });

        //             //  not passing- spy isn't called but data updates 
        //             // it('should work on a query', function() {
        //             //     var ref = mockObj.stubRef();
        //             //     ref.set({
        //             //         foo: 'baz'
        //             //     });
        //             //     ref.flush();
        //             //     var spy = spyOn(ref, 'update');
        //             //     var query = ref.limit(3);
        //             //     var obj = mockObj.makeObject(query);
        //             //     flushAll(query);
        //             //     obj.foo = 'bar';
        //             //     objMngr.save(obj);
        //             //     // flushAll(query);
        //             // expect(spy).toHaveBeenCalledWith({
        //             //     foo: 'bar'
        //             // }, jasmine.any(Function));
        //             // });
        //         });
        //         describe('remove', function() {
        //             it('should return a promise', function() {
        //                 expect(objMngr.remove(obj)).toBeAPromise();
        //             });

        //             it('should set $value to null and remove any local keys', function() {
        //                 expect($utils.dataKeys(obj).sort()).toEqual($utils.dataKeys(FIXTURE_DATA).sort());
        //                 objMngr.remove(obj);
        //                 flushAll();
        //                 expect($utils.dataKeys(obj)).toEqual([]);
        //             });

        //             it('should call remove on the Firebase ref', function() {
        //                 var spy = spyOn(obj.$ref(), 'remove');
        //                 expect(spy).not.toHaveBeenCalled();
        //                 objMngr.remove(obj);
        //                 flushAll();
        //                 expect(spy).toHaveBeenCalled(); // should not pass a key
        //             });

        //             it('should delete a primitive value', function() {
        //                 var snap = fakeSnap('foo');
        //                 obj.$$updated(snap);
        //                 flushAll();
        //                 expect(obj.$value).toBe('foo');
        //                 objMngr.remove(obj);
        //                 flushAll();
        //                 expect(obj.$value).toBe(null);
        //             });
        //             it('should resolve promise when passed result obj', function() {
        //                 var pass = jasmine.createSpy('resolve');
        //                 var fail = jasmine.createSpy('resolve');
        //                 var res = {
        //                     success: pass,
        //                     failure: fail
        //                 };
        //                 objMngr.remove(obj, res);
        //                 flushAll();
        //                 expect(fail).not.toHaveBeenCalled();
        //                 expect(pass).toHaveBeenCalled();
        //             });

        //             it('should reject promise when passed result obj and receive error', function() {
        //                 var err = new Error("ERROR!!!");
        //                 ref.failNext('remove', err);
        //                 var obj = mockObj.makeObject(null, ref);
        //                 var pass = jasmine.createSpy('resolve');
        //                 var fail = jasmine.createSpy('resolve');
        //                 var res = {
        //                     success: pass,
        //                     failure: fail
        //                 };
        //                 objMngr.remove(obj, res);
        //                 flushAll();
        //                 expect(fail).toHaveBeenCalled();
        //                 expect(pass).not.toHaveBeenCalled();
        //             });

        //             it('should trigger a value event for $watch listeners', function() {
        //                 var spy = jasmine.createSpy('$watch listener');
        //                 obj.$watch(spy);
        //                 objMngr.remove(obj);
        //                 flushAll();
        //                 expect(spy).toHaveBeenCalledWith({
        //                     event: 'value',
        //                     key: obj.$id
        //                 });
        //             });

        //             // test not passing
        //             // it('should work on a query', function() {
        //             //     ref.set({
        //             //         foo: 'bar'
        //             //     });
        //             //     ref.flush();
        //             //     var query = ref.limit(3);
        //             //     var obj = mockObj.makeObject(query);//$firebaseObject(query);
        //             //     flushAll(query);
        //             //     expect(obj.foo).toBe('bar');
        //             //     objMngr.remove(obj);
        //             //     flushAll(query);
        //             //     expect(obj.$value).toBe(null);
        //             // });
        //         });

        //         describe('$destroy', function() {
        //             it('should call off on Firebase ref', function() {
        //                 var spy = spyOn(obj.$ref(), 'off');
        //                 objMngr.destroy(obj);
        //                 expect(spy).toHaveBeenCalled();
        //             });

        //             it('should dispose of any bound instance', function() {
        //                 var $scope = $rootScope.$new();
        //                 spyOnWatch($scope);
        //                 // now bind to scope and destroy to see what happens
        //                 obj.$bindTo($scope, 'foo');
        //                 flushAll();
        //                 expect($scope.$watch).toHaveBeenCalled();
        //                 objMngr.destroy(obj);
        //                 flushAll();
        //                 expect($scope.$watch.$$$offSpy).toHaveBeenCalled();
        //             });

        //             it('should unbind if scope is destroyed', function() {
        //                 var $scope = $rootScope.$new();
        //                 spyOnWatch($scope);
        //                 obj.$bindTo($scope, 'foo');
        //                 flushAll();
        //                 expect($scope.$watch).toHaveBeenCalled();
        //                 $scope.$emit('$destroy');
        //                 flushAll();
        //                 expect($scope.$watch.$$$offSpy).toHaveBeenCalled();
        //             });
        //         });

        //         describe('bindTo', function() {
        //             it('should return a promise', function() {
        //                 var res = objMngr.bindTo(obj, $rootScope.$new(), 'test');
        //                 expect(res).toBeAPromise();
        //             });

        //             it('should resolve to an off function', function() {
        //                 var spy = jasmine.createSpy('resolve').and.callFake(function(off) {
        //                     expect(off).toBeA('function');
        //                 });
        //                 objMngr.bindTo(obj, $rootScope.$new(), 'test').then(spy, function() {
        //                     console.error(arguments);
        //                 });
        //                 flushAll();
        //                 expect(spy).toHaveBeenCalled();
        //             });

        //             it('should have data when it resolves', function() {
        //                 var spy = jasmine.createSpy('resolve').and.callFake(function() {
        //                     expect(obj).toEqual(jasmine.objectContaining(FIXTURE_DATA));
        //                 });
        //                 objMngr.bindTo(obj, $rootScope.$new(), 'test').then(spy);
        //                 flushAll();
        //                 expect(spy).toHaveBeenCalled();
        //             });

        //             it('should have data in $scope when resolved', function() {
        //                 var spy = jasmine.createSpy('resolve').and.callFake(function() {
        //                     expect($scope.test).toEqual($utils.parseScopeData(obj));
        //                     expect($scope.test.$id).toBe(obj.$id);
        //                 });
        //                 var $scope = $rootScope.$new();
        //                 objMngr.bindTo(obj, $scope, 'test').then(spy);
        //                 flushAll();
        //                 expect(spy).toHaveBeenCalled();
        //             });

        //             it('should send local changes to $firebase.$set', function() {
        //                 spyOn(obj.$ref(), 'set');
        //                 var $scope = $rootScope.$new();
        //                 objMngr.bindTo(obj, $scope, 'test');
        //                 flushAll();
        //                 obj.$ref().set.calls.reset();
        //                 $scope.$apply(function() {
        //                     $scope.test.bar = 'baz';
        //                 });
        //                 $timeout.flush();
        //                 expect(obj.$ref().set).toHaveBeenCalledWith(jasmine.objectContaining({
        //                     bar: 'baz'
        //                 }), jasmine.any(Function));
        //             });

        //             it('should allow data to be set inside promise callback', function() {
        //                 var ref = obj.$ref();
        //                 spyOn(ref, 'set');
        //                 var $scope = $rootScope.$new();
        //                 var newData = {
        //                     'bar': 'foo'
        //                 };
        //                 var spy = jasmine.createSpy('resolve').and.callFake(function() {
        //                     $scope.test = newData;
        //                 });
        //                 objMngr.bindTo(obj, $scope, 'test').then(spy);
        //                 flushAll(); // for $loaded
        //                 flushAll(); // for $watch timeout
        //                 expect(spy).toHaveBeenCalled();
        //                 expect($scope.test).toEqual(jasmine.objectContaining(newData));
        //                 expect(ref.set).toHaveBeenCalledWith(newData, jasmine.any(Function));
        //             });

        //             it('should apply server changes to scope variable', function() {
        //                 var $scope = $rootScope.$new();
        //                 objMngr.bindTo(obj, $scope, 'test');
        //                 $timeout.flush();
        //                 obj.$$updated(fakeSnap({
        //                     foo: 'bar'
        //                 }));
        //                 obj.$$notify();
        //                 flushAll();
        //                 expect($scope.test).toEqual({
        //                     foo: 'bar',
        //                     $id: obj.$id,
        //                     $priority: obj.$priority
        //                 });
        //             });

        //             it('will replace the object on scope if new server value is not deeply equal', function() {
        //                 var $scope = $rootScope.$new();
        //                 objMngr.bindTo(obj, $scope, 'test');
        //                 $timeout.flush();
        //                 obj.$$updated(fakeSnap({
        //                     foo: 'bar'
        //                 }));
        //                 obj.$$notify();
        //                 flushAll();
        //                 var oldTest = $scope.test;
        //                 obj.$$updated(fakeSnap({
        //                     foo: 'baz'
        //                 }));
        //                 obj.$$notify();
        //                 expect($scope.test === oldTest).toBe(false);
        //             });

        //             it('will leave the scope value alone if new server value is deeply equal', function() {
        //                 var $scope = $rootScope.$new();
        //                 objMngr.bindTo(obj, $scope, 'test');
        //                 $timeout.flush();
        //                 obj.$$updated(fakeSnap({
        //                     foo: 'bar'
        //                 }));
        //                 obj.$$notify();
        //                 flushAll();
        //                 var oldTest = $scope.test;
        //                 obj.$$updated(fakeSnap({
        //                     foo: 'bar'
        //                 }));
        //                 obj.$$notify();
        //                 expect($scope.test === oldTest).toBe(true);
        //             });

        //             it('should stop binding when off function is called', function() {
        //                 var origData = $utils.scopeData(obj);
        //                 var $scope = $rootScope.$new();
        //                 var spy = jasmine.createSpy('$bindTo').and.callFake(function(off) {
        //                     expect($scope.obj).toEqual(origData);
        //                     off();
        //                 });
        //                 objMngr.bindTo(obj, $scope, 'obj').then(spy);
        //                 flushAll();
        //                 obj.$$updated(fakeSnap({
        //                     foo: 'bar'
        //                 }));
        //                 flushAll();
        //                 expect(spy).toHaveBeenCalled();
        //                 expect($scope.obj).toEqual(origData);
        //             });

        //             it('should not destroy remote data if local is pre-set', function() {
        //                 var origValue = $utils.scopeData(obj);
        //                 var $scope = $rootScope.$new();
        //                 $scope.test = {
        //                     foo: true
        //                 };
        //                 objMngr.bindTo(obj, $scope, 'test');
        //                 flushAll();
        //                 expect($utils.scopeData(obj)).toEqual(origValue);
        //             });

        //             it('should not fail if remote data is null', function() {
        //                 var $scope = $rootScope.$new();
        //                 var obj = mockObj.makeObject();
        //                 objMngr.bindTo(obj, $scope, 'test');
        //                 obj.$ref().set(null);
        //                 flushAll(obj.$ref());
        //                 expect($scope.test).toEqual({
        //                     $value: null,
        //                     $id: obj.$id,
        //                     $priority: obj.$priority
        //                 });
        //             });

        //             it('should delete $value if set to an object', function() {
        //                 var $scope = $rootScope.$new();
        //                 var obj = mockObj.makeObject();
        //                 objMngr.bindTo(obj, $scope, 'test');
        //                 flushAll(obj.$ref());
        //                 expect($scope.test).toEqual({
        //                     $value: null,
        //                     $id: obj.$id,
        //                     $priority: obj.$priority
        //                 });
        //                 $scope.$apply(function() {
        //                     $scope.test.text = 'hello';
        //                 });
        //                 flushAll();
        //                 obj.$ref().flush();
        //                 flushAll();
        //                 expect($scope.test).toEqual({
        //                     text: 'hello',
        //                     $id: obj.$id,
        //                     $priority: obj.$priority
        //                 });
        //             });

        //             it('should update $priority if $priority changed in $scope', function() {
        //                 var $scope = $rootScope.$new();
        //                 var spy = spyOn(obj.$ref(), 'set');
        //                 objMngr.bindTo(obj, $scope, 'test');
        //                 $timeout.flush();
        //                 $scope.$apply(function() {
        //                     $scope.test.$priority = 999;
        //                 });
        //                 $interval.flush(500);
        //                 $timeout.flush();
        //                 expect(spy).toHaveBeenCalledWith(jasmine.objectContaining({
        //                     '.priority': 999
        //                 }), jasmine.any(Function));
        //             });

        //             it('should update $value if $value changed in $scope', function() {
        //                 var $scope = $rootScope.$new();
        //                 // ref.flush();
        //                 obj.$$updated(testutils.refSnap(ref, 'foo', null));
        //                 expect(obj.$value).toBe('foo');
        //                 var spy = spyOn(ref, 'set');
        //                 objMngr.bindTo(obj, $scope, 'test');
        //                 flushAll();
        //                 $scope.$apply(function() {
        //                     $scope.test.$value = 'bar';
        //                 });
        //                 $interval.flush(500);
        //                 $timeout.flush();
        //                 expect(spy).toHaveBeenCalledWith(jasmine.objectContaining({
        //                     '.value': 'bar'
        //                 }), jasmine.any(Function));
        //             });

        //             it('should only call $$scopeUpdated once if both metaVars and properties change in the same $digest', function() {
        //                 var $scope = $rootScope.$new();
        //                 ref.autoFlush(true);
        //                 ref.setWithPriority({
        //                     text: 'hello'
        //                 }, 3);
        //                 flushAll();
        //                 flushAll();
        //                 objMngr.bindTo(obj, $scope, 'test');
        //                 $scope.$apply();
        //                 expect($scope.test).toEqual({
        //                     text: 'hello',
        //                     $id: obj.$id,
        //                     $priority: 3
        //                 });
        //                 var callCount = 0;
        //                 var old$scopeUpdated = obj.$$scopeUpdated;
        //                 obj.$$scopeUpdated = function() {
        //                     callCount++;
        //                     return old$scopeUpdated.apply(this, arguments);
        //                 };
        //                 $scope.$apply(function() {
        //                     $scope.test.text = 'goodbye';
        //                     $scope.test.$priority = 4;
        //                 });
        //                 flushAll();
        //                 flushAll();
        //                 flushAll();
        //                 flushAll();
        //                 expect(callCount).toEqual(1);
        //             });

        //             //Not passing; but passed for afEntity

        //             // it('should throw error if double bound', function() {
        //             //     var $scope = $rootScope.$new();
        //             //     var aSpy = jasmine.createSpy('firstBind');
        //             //     var bResolve = jasmine.createSpy('secondBindResolve');
        //             //     var bReject = jasmine.createSpy('secondBindReject');
        //             //     objMngr.bindTo(obj, $scope, 'a').then(aSpy);
        //             //     flushAll();
        //             //     expect(aSpy).toHaveBeenCalled();
        //             //     objMngr.bindTo(obj, $scope, 'b').then(bResolve, bReject);
        //             //     flushAll();
        //             //     flushAll();
        //             //     expect(bResolve).not.toHaveBeenCalled();
        //             //     expect(bReject).toHaveBeenCalled();
        //             // });

        //             it('should accept another binding after off is called', function() {
        //                 var $scope = $rootScope.$new();
        //                 var aSpy = jasmine.createSpy('firstResolve').and.callFake(function(unbind) {
        //                     unbind();
        //                     var bSpy = jasmine.createSpy('secondResolve');
        //                     var bFail = jasmine.createSpy('secondReject');
        //                     objMngr.bindTo(obj, $scope, 'b').then(bSpy, bFail);
        //                     $scope.$digest();
        //                     expect(bSpy).toHaveBeenCalled();
        //                     expect(bFail).not.toHaveBeenCalled();
        //                 });
        //                 objMngr.bindTo(obj, $scope, 'a').then(aSpy);
        //                 flushAll();
        //                 expect(aSpy).toHaveBeenCalled();
        //             });
        //         });



        //         function flushAll() {
        //             Array.prototype.slice.call(arguments, 0).forEach(function(o) {
        //                 angular.isFunction(o.resolve) ? o.resolve() : o.flush();
        //             });
        //             try {
        //                 obj.$ref().flush();
        //             } catch (e) {}
        //             try {
        //                 $interval.flush(500);
        //             } catch (e) {}
        //             try {
        //                 $timeout.flush();
        //             } catch (e) {}
        //         }

        //         function fakeSnap(data, pri) {
        //             return testutils.refSnap(testutils.ref('data/a'), data, pri);
        //         }

        //         function spyOnWatch($scope) {
        //             // hack on $scope.$watch to return our spy instead of the usual
        //             // so that we can determine if it gets called
        //             var _watch = $scope.$watch;
        //             spyOn($scope, '$watch').and.callFake(function(varName, callback) {
        //                 // call the real watch method and store the real off method
        //                 var _off = _watch.call($scope, varName, callback);
        //                 // replace it with our 007
        //                 var offSpy = jasmine.createSpy('off method for $watch').and.callFake(function() {
        //                     // call the real off method
        //                     _off();
        //                 });
        //                 $scope.$watch.$$$offSpy = offSpy;
        //                 return offSpy;

    });
})();
