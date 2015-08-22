(function() {
    "use strict";
    describe('afUtils Service', function() {
        var afEntity, $firebaseObject, $firebaseArray, $firebaseAuth;


        beforeEach(function() {
            MockFirebase.override();
            module('utils.afApi');
            // module('testutils', function($provide) {
            //     $provide.value('$log', {
            //         error: function() {
            //             log.error.push(Array.prototype.slice.call(arguments));
            //         }
            //     });
            //     module('firebase', function($provide) {
            //         $provide.value('$log', {
            //             warn: function() {
            //                 log.warn.push(Array.prototype.slice.call(arguments, 0));
            //             }
            //         })
            //     });

            inject(function(_afEntity_, _$firebaseObject_, _$firebaseArray_,
                _$firebaseAuth_) {
                $firebaseAuth = _$firebaseAuth_;
                $firebaseArray = _$firebaseArray_;
                $firebaseObject = _$firebaseObject_;
                afEntity = _afEntity_;
            });
        });


        it("set = 'auth'", function() {
            var ref = new MockFirebase();
            var testInst = $firebaseAuth(ref);
            expect(afEntity.set().prototype === testInst.prototype).toBeTruthy();
        });
        it("set = 'object'", function() {
            var ref = new MockFirebase();
            var testInst = $firebaseObject(ref);
            expect(afEntity.set("object", "users").prototype === testInst.prototype).toBeTruthy();
        });
        it("set = 'array'", function() {
            var ref = new MockFirebase();
            var testInst = $firebaseArray(ref);
            expect(afEntity.set("array", ["users", "phones", "1"]).prototype === testInst.prototype).toBeTruthy();
        });
        describe("accessible $firebaseObject methods", function() {
            var entity, val, meth;
            var methodsForObj = [
                ['$id', 'string'],
                ['$priority', 'object'],
                ['$ref', 'function'],
                ['$save', 'function'],
                ['$loaded', 'function'],
                ['$destroy', 'function'],
                ['$bindTo', 'function'],
                ['$watch', 'function'],
                ['$loaded', 'function'],
                ['$remove', 'function']
            ];

            function test_entity_methods(y) {
                it(y[0] + " should be a " + y[1], function() {
                    entity = afEntity.set("object", "users");
                    val = y[1];
                    meth = y[0];
                    expect(typeof entity[meth]).toEqual(val);
                });
            }
            methodsForObj.forEach(test_entity_methods);
        });
        describe("accessible $firebaseArray methods", function() {
            var entity, val, meth;
            var methods = [
                ['$add', 'function'],
                ['$remove', 'function'],
                ['$save', 'function'],
                ['$getRecord', 'function'],
                ['$keyAt', 'function'],
                ['$indexFor', 'function'],
                ['$loaded', 'function'],
                ['$ref', 'function'],
                ['$watch', 'function'],
                ['$destroy', 'function']
            ];

            function test_entity_methods(y) {
                it(y[0] + " should be a " + y[1], function() {
                    entity = afEntity.set("array", "users");
                    val = y[1];
                    meth = y[0];
                    expect(typeof entity[meth]).toEqual(val);
                });
            }
            methods.forEach(test_entity_methods);
        });
        describe("accessible $firebaseAuth methods", function() {
            // can't test $unAuth via this macro
            var entity, val, meth;
            var methods = [
                ['$authWithCustomToken', 'function'],
                ['$authAnonymously', 'function'],
                ['$authWithPassword', 'function'],
                ['$authWithOAuthPopup', 'function'],
                ['$authWithOAuthRedirect', 'function'],
                ['$getAuth', 'function'],
                ['$onAuth', 'function'],
                ['$waitForAuth', 'function'],
                ['$requireAuth', 'function'],
                ['$createUser', 'function'],
                ['$changePassword', 'function'],
                ['$changeEmail', 'function'],
                ['$removeUser', 'function'],
                ['$resetPassword', 'function']
            ];

            function test_entity_methods(y) {
                it(y[0] + " should be a " + y[1], function() {
                    entity = afEntity.set();
                    val = y[1];
                    meth = y[0];
                    expect(typeof entity[meth]).toEqual(val);
                });
            }
            methods.forEach(test_entity_methods);
        });
    });
})(angular);

// describe('$firebaseObject methods', function() {
//     var DEFAULT_ID = 'ID1';
//     var FIXTURE_DATA = {
//         aString: 'a string',
//         aNumber: 1,
//         aBoolean: false,
//         anObject: {
//             bString: 'another one'
//         }
//     };

//     function stubRef() {
//         return new MockFirebase('Mock:://').child('data').child(DEFAULT_ID);
//     }

//     function makeObject(data, ref) {
//         if (!ref) {
//             ref = stubRef();
//         }
//         //changed so testing afEntity
//         var obj = afEntity.set("object", ref);
//         if (angular.isDefined(data)) {
//             ref.ref().set(data);
//             ref.flush();
//             $timeout.flush();
//         }
//         return obj;
//     }

//     beforeEach(function() {
//         var obj = makeObject(FIXTURE_DATA);
//         log = {
//             error: []
//         };
//     });

//     describe('constructor', function() {
//         it('should set the record id', function() {
//             expect(obj.$id).toEqual(obj.$ref().key());
//         });

//         it('should accept a query', function() {
//             var obj = makeObject(FIXTURE_DATA, stubRef().limit(1).startAt(null));
//             flushAll();
//             obj.$$updated(testutils.snap({
//                 foo: 'bar'
//             }));
//             expect(obj).toEqual(jasmine.objectContaining({
//                 foo: 'bar'
//             }));
//         });

//         it('should apply $$defaults if they exist', function() {
//             var F = $firebaseObject.$extend({
//                 $$defaults: {
//                     aNum: 0,
//                     aStr: 'foo',
//                     aBool: false
//                 }
//             });
//             var ref = stubRef();
//             var obj = new F(ref);
//             ref.flush();
//             expect(obj).toEqual(jasmine.objectContaining({
//                 aNum: 0,
//                 aStr: 'foo',
//                 aBool: false
//             }));
//         })
//     });

//     describe('$save', function() {
//         it('should call $firebase.$set', function() {
//             spyOn(obj.$ref(), 'set');
//             obj.foo = 'bar';
//             obj.$save();
//             expect(obj.$ref().set).toHaveBeenCalled();
//         });

//         it('should return a promise', function() {
//             expect(obj.$save()).toBeAPromise();
//         });

//         it('should resolve promise to the ref for this object', function() {
//             var whiteSpy = jasmine.createSpy('resolve');
//             var blackSpy = jasmine.createSpy('reject');
//             obj.$save().then(whiteSpy, blackSpy);
//             expect(whiteSpy).not.toHaveBeenCalled();
//             flushAll();
//             expect(whiteSpy).toHaveBeenCalled();
//             expect(blackSpy).not.toHaveBeenCalled();
//         });

//         it('should reject promise on failure', function() {
//             var whiteSpy = jasmine.createSpy('resolve');
//             var blackSpy = jasmine.createSpy('reject');
//             var err = new Error('test_fail');
//             obj.$ref().failNext('set', err);
//             obj.$save().then(whiteSpy, blackSpy);
//             expect(blackSpy).not.toHaveBeenCalled();
//             flushAll();
//             expect(whiteSpy).not.toHaveBeenCalled();
//             expect(blackSpy).toHaveBeenCalledWith(err);
//         });

//         it('should trigger watch event', function() {
//             var spy = jasmine.createSpy('$watch');
//             obj.$watch(spy);
//             obj.foo = 'watchtest';
//             obj.$save();
//             flushAll();
//             expect(spy).toHaveBeenCalledWith(jasmine.objectContaining({
//                 event: 'value',
//                 key: obj.$id
//             }));
//         });

//         it('should work on a query', function() {
//             var ref = stubRef();
//             ref.set({
//                 foo: 'baz'
//             });
//             ref.flush();
//             var spy = spyOn(ref, 'update');
//             var query = ref.limit(3);
//             var obj = $firebaseObject(query);
//             flushAll(query);
//             obj.foo = 'bar';
//             obj.$save();
//             flushAll(query);
//             expect(spy).toHaveBeenCalledWith({
//                 foo: 'bar'
//             }, jasmine.any(Function));
//         });
//     });

//     describe('$loaded', function() {
//         it('should return a promise', function() {
//             expect(obj.$loaded()).toBeAPromise();
//         });

//         it('should resolve when all server data is downloaded', function() {
//             var whiteSpy = jasmine.createSpy('resolve');
//             var blackSpy = jasmine.createSpy('reject');
//             var obj = makeObject();
//             obj.$loaded().then(whiteSpy, blackSpy);
//             obj.$ref().flush();
//             flushAll();
//             expect(whiteSpy).toHaveBeenCalledWith(obj);
//             expect(blackSpy).not.toHaveBeenCalled();
//         });

//         it('should reject if the ready promise is rejected', function() {
//             var whiteSpy = jasmine.createSpy('resolve');
//             var blackSpy = jasmine.createSpy('reject');
//             var ref = stubRef();
//             var err = new Error('test_fail');
//             ref.failNext('once', err);
//             var obj = makeObject(null, ref);
//             obj.$loaded().then(whiteSpy, blackSpy);
//             flushAll();
//             expect(whiteSpy).not.toHaveBeenCalled();
//             expect(blackSpy).toHaveBeenCalledWith(err);
//         });

//         it('should resolve to the FirebaseObject instance', function() {
//             var spy = jasmine.createSpy('loaded');
//             obj.$loaded().then(spy);
//             flushAll();
//             expect(spy).toHaveBeenCalledWith(obj);
//         });

//         it('should contain all data at the time $loaded is called', function() {
//             var obj = makeObject();
//             var spy = jasmine.createSpy('loaded').and.callFake(function(data) {
//                 expect(data).toEqual(jasmine.objectContaining(FIXTURE_DATA));
//             });
//             obj.$loaded(spy);
//             obj.$ref().set(FIXTURE_DATA);
//             flushAll(obj.$ref());
//             expect(spy).toHaveBeenCalled();
//         });

//         it('should trigger if attached before load completes', function() {
//             var obj = makeObject();
//             var spy = jasmine.createSpy('$loaded');
//             obj.$loaded(spy);
//             expect(spy).not.toHaveBeenCalled();
//             flushAll(obj.$ref());
//             expect(spy).toHaveBeenCalled();
//         });

//         it('should trigger if attached after load completes', function() {
//             var obj = makeObject();
//             var spy = jasmine.createSpy('$loaded');
//             obj.$ref().flush();
//             obj.$loaded(spy);
//             flushAll();
//             expect(spy).toHaveBeenCalled();
//         });

//         it('should resolve properly if function passed directly into $loaded', function() {
//             var spy = jasmine.createSpy('loaded');
//             obj.$loaded(spy);
//             flushAll();
//             expect(spy).toHaveBeenCalledWith(obj);
//         });

//         it('should reject properly if function passed directly into $loaded', function() {
//             var whiteSpy = jasmine.createSpy('resolve');
//             var blackSpy = jasmine.createSpy('reject');
//             var err = new Error('test_fail');
//             var ref = stubRef();
//             ref.failNext('once', err);
//             var obj = makeObject(undefined, ref);
//             obj.$loaded(whiteSpy, blackSpy);
//             ref.flush();
//             $timeout.flush();
//             expect(whiteSpy).not.toHaveBeenCalled();
//             expect(blackSpy).toHaveBeenCalledWith(err);
//         });
//     });

//     describe('$ref', function() {
//         it('should return the Firebase instance that created it', function() {
//             var ref = stubRef();
//             var obj = $firebaseObject(ref);
//             expect(obj.$ref()).toBe(ref);
//         });
//     });

//     describe('$bindTo', function() {
//         it('should return a promise', function() {
//             var res = obj.$bindTo($rootScope.$new(), 'test');
//             expect(res).toBeAPromise();
//         });

//         it('should resolve to an off function', function() {
//             var spy = jasmine.createSpy('resolve').and.callFake(function(off) {
//                 expect(off).toBeA('function');
//             });
//             obj.$bindTo($rootScope.$new(), 'test').then(spy, function() {
//                 console.error(arguments);
//             });
//             flushAll();
//             expect(spy).toHaveBeenCalled();
//         });

//         it('should have data when it resolves', function() {
//             var spy = jasmine.createSpy('resolve').and.callFake(function() {
//                 expect(obj).toEqual(jasmine.objectContaining(FIXTURE_DATA));
//             });
//             obj.$bindTo($rootScope.$new(), 'test').then(spy);
//             flushAll();
//             expect(spy).toHaveBeenCalled();
//         });

//         it('should have data in $scope when resolved', function() {
//             var spy = jasmine.createSpy('resolve').and.callFake(function() {
//                 expect($scope.test).toEqual($utils.parseScopeData(obj));
//                 expect($scope.test.$id).toBe(obj.$id);
//             });
//             var $scope = $rootScope.$new();
//             obj.$bindTo($scope, 'test').then(spy);
//             flushAll();
//             expect(spy).toHaveBeenCalled();
//         });

//         it('should send local changes to $firebase.$set', function() {
//             spyOn(obj.$ref(), 'set');
//             var $scope = $rootScope.$new();
//             obj.$bindTo($scope, 'test');
//             flushAll();
//             obj.$ref().set.calls.reset();
//             $scope.$apply(function() {
//                 $scope.test.bar = 'baz';
//             });
//             $timeout.flush();
//             expect(obj.$ref().set).toHaveBeenCalledWith(jasmine.objectContaining({
//                 bar: 'baz'
//             }), jasmine.any(Function));
//         });

//         it('should allow data to be set inside promise callback', function() {
//             var ref = obj.$ref();
//             spyOn(ref, 'set');
//             var $scope = $rootScope.$new();
//             var newData = {
//                 'bar': 'foo'
//             };
//             var spy = jasmine.createSpy('resolve').and.callFake(function() {
//                 $scope.test = newData;
//             });
//             obj.$bindTo($scope, 'test').then(spy);
//             flushAll(); // for $loaded
//             flushAll(); // for $watch timeout
//             expect(spy).toHaveBeenCalled();
//             expect($scope.test).toEqual(jasmine.objectContaining(newData));
//             expect(ref.set).toHaveBeenCalledWith(newData, jasmine.any(Function));
//         });

//         it('should apply server changes to scope variable', function() {
//             var $scope = $rootScope.$new();
//             obj.$bindTo($scope, 'test');
//             $timeout.flush();
//             obj.$$updated(fakeSnap({
//                 foo: 'bar'
//             }));
//             obj.$$notify();
//             flushAll();
//             expect($scope.test).toEqual({
//                 foo: 'bar',
//                 $id: obj.$id,
//                 $priority: obj.$priority
//             });
//         });

//         it('will replace the object on scope if new server value is not deeply equal', function() {
//             var $scope = $rootScope.$new();
//             obj.$bindTo($scope, 'test');
//             $timeout.flush();
//             obj.$$updated(fakeSnap({
//                 foo: 'bar'
//             }));
//             obj.$$notify();
//             flushAll();
//             var oldTest = $scope.test;
//             obj.$$updated(fakeSnap({
//                 foo: 'baz'
//             }));
//             obj.$$notify();
//             expect($scope.test === oldTest).toBe(false);
//         });

//         it('will leave the scope value alone if new server value is deeply equal', function() {
//             var $scope = $rootScope.$new();
//             obj.$bindTo($scope, 'test');
//             $timeout.flush();
//             obj.$$updated(fakeSnap({
//                 foo: 'bar'
//             }));
//             obj.$$notify();
//             flushAll();
//             var oldTest = $scope.test;
//             obj.$$updated(fakeSnap({
//                 foo: 'bar'
//             }));
//             obj.$$notify();
//             expect($scope.test === oldTest).toBe(true);
//         });

//         it('should stop binding when off function is called', function() {
//             var origData = $utils.scopeData(obj);
//             var $scope = $rootScope.$new();
//             var spy = jasmine.createSpy('$bindTo').and.callFake(function(off) {
//                 expect($scope.obj).toEqual(origData);
//                 off();
//             });
//             obj.$bindTo($scope, 'obj').then(spy);
//             flushAll();
//             obj.$$updated(fakeSnap({
//                 foo: 'bar'
//             }));
//             flushAll();
//             expect(spy).toHaveBeenCalled();
//             expect($scope.obj).toEqual(origData);
//         });

//         it('should not destroy remote data if local is pre-set', function() {
//             var origValue = $utils.scopeData(obj);
//             var $scope = $rootScope.$new();
//             $scope.test = {
//                 foo: true
//             };
//             obj.$bindTo($scope, 'test');
//             flushAll();
//             expect($utils.scopeData(obj)).toEqual(origValue);
//         });

//         it('should not fail if remote data is null', function() {
//             var $scope = $rootScope.$new();
//             var obj = makeObject();
//             obj.$bindTo($scope, 'test');
//             obj.$ref().set(null);
//             flushAll(obj.$ref());
//             expect($scope.test).toEqual({
//                 $value: null,
//                 $id: obj.$id,
//                 $priority: obj.$priority
//             });
//         });

//         it('should delete $value if set to an object', function() {
//             var $scope = $rootScope.$new();
//             var obj = makeObject();
//             obj.$bindTo($scope, 'test');
//             flushAll(obj.$ref());
//             expect($scope.test).toEqual({
//                 $value: null,
//                 $id: obj.$id,
//                 $priority: obj.$priority
//             });
//             $scope.$apply(function() {
//                 $scope.test.text = 'hello';
//             });
//             flushAll();
//             obj.$ref().flush();
//             flushAll();
//             expect($scope.test).toEqual({
//                 text: 'hello',
//                 $id: obj.$id,
//                 $priority: obj.$priority
//             });
//         });

//         it('should update $priority if $priority changed in $scope', function() {
//             var $scope = $rootScope.$new();
//             var spy = spyOn(obj.$ref(), 'set');
//             obj.$bindTo($scope, 'test');
//             $timeout.flush();
//             $scope.$apply(function() {
//                 $scope.test.$priority = 999;
//             });
//             $interval.flush(500);
//             $timeout.flush();
//             expect(spy).toHaveBeenCalledWith(jasmine.objectContaining({
//                 '.priority': 999
//             }), jasmine.any(Function));
//         });

//         it('should update $value if $value changed in $scope', function() {
//             var $scope = $rootScope.$new();
//             var ref = stubRef();
//             var obj = $firebaseObject(ref);
//             ref.flush();
//             obj.$$updated(testutils.refSnap(ref, 'foo', null));
//             expect(obj.$value).toBe('foo');
//             var spy = spyOn(ref, 'set');
//             obj.$bindTo($scope, 'test');
//             flushAll();
//             $scope.$apply(function() {
//                 $scope.test.$value = 'bar';
//             });
//             $interval.flush(500);
//             $timeout.flush();
//             expect(spy).toHaveBeenCalledWith(jasmine.objectContaining({
//                 '.value': 'bar'
//             }), jasmine.any(Function));
//         });

//         it('should only call $$scopeUpdated once if both metaVars and properties change in the same $digest', function() {
//             var $scope = $rootScope.$new();
//             var ref = stubRef();
//             ref.autoFlush(true);
//             ref.setWithPriority({
//                 text: 'hello'
//             }, 3);
//             var obj = $firebaseObject(ref);
//             flushAll();
//             flushAll();
//             obj.$bindTo($scope, 'test');
//             $scope.$apply();
//             expect($scope.test).toEqual({
//                 text: 'hello',
//                 $id: obj.$id,
//                 $priority: 3
//             });
//             var callCount = 0;
//             var old$scopeUpdated = obj.$$scopeUpdated;
//             obj.$$scopeUpdated = function() {
//                 callCount++;
//                 return old$scopeUpdated.apply(this, arguments);
//             };
//             $scope.$apply(function() {
//                 $scope.test.text = 'goodbye';
//                 $scope.test.$priority = 4;
//             });
//             flushAll();
//             flushAll();
//             flushAll();
//             flushAll();
//             expect(callCount).toEqual(1);
//         });

//         it('should throw error if double bound', function() {
//             var $scope = $rootScope.$new();
//             var aSpy = jasmine.createSpy('firstBind');
//             var bResolve = jasmine.createSpy('secondBindResolve');
//             var bReject = jasmine.createSpy('secondBindReject');
//             obj.$bindTo($scope, 'a').then(aSpy);
//             flushAll();
//             expect(aSpy).toHaveBeenCalled();
//             obj.$bindTo($scope, 'b').then(bResolve, bReject);
//             flushAll();
//             expect(bResolve).not.toHaveBeenCalled();
//             expect(bReject).toHaveBeenCalled();
//         });

//         it('should accept another binding after off is called', function() {
//             var $scope = $rootScope.$new();
//             var aSpy = jasmine.createSpy('firstResolve').and.callFake(function(unbind) {
//                 unbind();
//                 var bSpy = jasmine.createSpy('secondResolve');
//                 var bFail = jasmine.createSpy('secondReject');
//                 obj.$bindTo($scope, 'b').then(bSpy, bFail);
//                 $scope.$digest();
//                 expect(bSpy).toHaveBeenCalled();
//                 expect(bFail).not.toHaveBeenCalled();
//             });
//             obj.$bindTo($scope, 'a').then(aSpy);
//             flushAll();
//             expect(aSpy).toHaveBeenCalled();
//         });
//     });

//     describe('$watch', function() {
//         it('should return a deregistration function', function() {
//             var spy = jasmine.createSpy('$watch');
//             var off = obj.$watch(spy);
//             obj.foo = 'watchtest';
//             obj.$save();
//             flushAll();
//             expect(spy).toHaveBeenCalled();
//             spy.calls.reset();
//             off();
//             expect(spy).not.toHaveBeenCalled();
//         });

//         it('additional calls to the deregistration function should be silently ignored', function() {
//             var spy = jasmine.createSpy('$watch');
//             var off = obj.$watch(spy);
//             off();
//             off();
//             obj.foo = 'watchtest';
//             obj.$save();
//             flushAll();
//             expect(spy).not.toHaveBeenCalled();
//         });
//     });

//     describe('$remove', function() {
//         it('should return a promise', function() {
//             expect(obj.$remove()).toBeAPromise();
//         });

//         it('should set $value to null and remove any local keys', function() {
//             expect($utils.dataKeys(obj).sort()).toEqual($utils.dataKeys(FIXTURE_DATA).sort());
//             obj.$remove();
//             flushAll();
//             expect($utils.dataKeys(obj)).toEqual([]);
//         });

//         it('should call remove on the Firebase ref', function() {
//             var spy = spyOn(obj.$ref(), 'remove');
//             expect(spy).not.toHaveBeenCalled();
//             obj.$remove();
//             flushAll();
//             expect(spy).toHaveBeenCalled(); // should not pass a key
//         });

//         it('should delete a primitive value', function() {
//             var snap = fakeSnap('foo');
//             obj.$$updated(snap);
//             flushAll();
//             expect(obj.$value).toBe('foo');
//             obj.$remove();
//             flushAll();
//             expect(obj.$value).toBe(null);
//         });

//         it('should trigger a value event for $watch listeners', function() {
//             var spy = jasmine.createSpy('$watch listener');
//             obj.$watch(spy);
//             obj.$remove();
//             flushAll();
//             expect(spy).toHaveBeenCalledWith({
//                 event: 'value',
//                 key: obj.$id
//             });
//         });

//         it('should work on a query', function() {
//             var ref = stubRef();
//             ref.set({
//                 foo: 'bar'
//             });
//             ref.flush();
//             var query = ref.limit(3);
//             var obj = $firebaseObject(query);
//             flushAll(query);
//             expect(obj.foo).toBe('bar');
//             obj.$remove();
//             flushAll(query);
//             expect(obj.$value).toBe(null);
//         });
//     });

//     describe('$destroy', function() {
//         it('should call off on Firebase ref', function() {
//             var spy = spyOn(obj.$ref(), 'off');
//             obj.$destroy();
//             expect(spy).toHaveBeenCalled();
//         });

//         it('should dispose of any bound instance', function() {
//             var $scope = $rootScope.$new();
//             spyOnWatch($scope);
//             // now bind to scope and destroy to see what happens
//             obj.$bindTo($scope, 'foo');
//             flushAll();
//             expect($scope.$watch).toHaveBeenCalled();
//             obj.$destroy();
//             flushAll();
//             expect($scope.$watch.$$$offSpy).toHaveBeenCalled();
//         });

//         it('should unbind if scope is destroyed', function() {
//             var $scope = $rootScope.$new();
//             spyOnWatch($scope);
//             obj.$bindTo($scope, 'foo');
//             flushAll();
//             expect($scope.$watch).toHaveBeenCalled();
//             $scope.$emit('$destroy');
//             flushAll();
//             expect($scope.$watch.$$$offSpy).toHaveBeenCalled();
//         });
//     });

//     describe('$extend', function() {
//         it('should preserve child prototype', function() {
//             function Extend() {
//                 $firebaseObject.apply(this, arguments);
//             }
//             Extend.prototype.foo = function() {};
//             var ref = stubRef();
//             $firebaseObject.$extend(Extend);
//             var arr = new Extend(ref);
//             expect(arr.foo).toBeA('function');
//         });

//         it('should return child class', function() {
//             function A() {}
//             var res = $firebaseObject.$extend(A);
//             expect(res).toBe(A);
//         });

//         it('should be instanceof $firebaseObject', function() {
//             function A() {}
//             $firebaseObject.$extend(A);
//             expect(new A(stubRef())).toBeInstanceOf($firebaseObject);
//         });

//         it('should add on methods passed into function', function() {
//             function foo() {
//                 return 'foo';
//             }
//             var F = $firebaseObject.$extend({
//                 foo: foo
//             });
//             var res = F(stubRef());
//             expect(res.$$updated).toBeA('function');
//             expect(res.foo).toBeA('function');
//             expect(res.foo()).toBe('foo');
//         });


//         it('should work with the new keyword', function() {
//             var fn = function() {};
//             var Res = $firebaseObject.$extend({
//                 foo: fn
//             });
//             expect(new Res(stubRef()).foo).toBeA('function');
//         });

//         it('should work without the new keyword', function() {
//             var fn = function() {};
//             var Res = $firebaseObject.$extend({
//                 foo: fn
//             });
//             expect(Res(stubRef()).foo).toBeA('function');
//         });
//     });

//     describe('$$updated', function() {
//         it('should add keys to local data', function() {
//             obj.$$updated(fakeSnap({
//                 'key1': true,
//                 'key2': 5
//             }));
//             expect(obj.key1).toBe(true);
//             expect(obj.key2).toBe(5);
//         });

//         it('should remove old keys', function() {
//             var keys = ['aString', 'aNumber', 'aBoolean', 'anObject'];
//             keys.forEach(function(k) {
//                 expect(obj).toHaveKey(k);
//             });
//             obj.$$updated(fakeSnap(null));
//             flushAll();
//             keys.forEach(function(k) {
//                 expect(obj).not.toHaveKey(k);
//             });
//         });

//         it('should assign null to $value', function() {
//             obj.$$updated(fakeSnap(null));
//             expect(obj.$value).toBe(null);
//         });

//         it('should assign primitive value to $value', function() {
//             obj.$$updated(fakeSnap(false));
//             expect(obj.$value).toBe(false);
//         });

//         it('should remove other keys when setting primitive', function() {
//             var keys = Object.keys(obj);
//         });

//         it('should preserve the id', function() {
//             obj.$id = 'change_id_for_test';
//             obj.$$updated(fakeSnap(true));
//             expect(obj.$id).toBe('change_id_for_test');
//         });

//         it('should set the priority', function() {
//             obj.$priority = false;
//             obj.$$updated(fakeSnap(null, true));
//             expect(obj.$priority).toBe(true);
//         });

//         it('should apply $$defaults if they exist', function() {
//             var F = $firebaseObject.$extend({
//                 $$defaults: {
//                     baz: 'baz',
//                     aString: 'bravo'
//                 }
//             });
//             var obj = new F(stubRef());
//             obj.$$updated(fakeSnap(FIXTURE_DATA));
//             expect(obj.aString).toBe(FIXTURE_DATA.aString);
//             expect(obj.baz).toBe('baz');
//         });
//     });

//     describe('$$error', function() {
//         it('will log an error', function() {
//             obj.$$error(new Error());
//             expect(log.error).toHaveLength(1);
//         });

//         it('will call $destroy', function() {
//             obj.$destroy = jasmine.createSpy('$destroy');
//             var error = new Error();
//             obj.$$error(error);
//             expect(obj.$destroy).toHaveBeenCalledWith(error);
//         });
//     });

//     function flushAll() {
//         Array.prototype.slice.call(arguments, 0).forEach(function(o) {
//             angular.isFunction(o.resolve) ? o.resolve() : o.flush();
//         });
//         try {
//             obj.$ref().flush();
//         } catch (e) {}
//         try {
//             $interval.flush(500);
//         } catch (e) {}
//         try {
//             $timeout.flush();
//         } catch (e) {}
//     }


//     function spyOnWatch($scope) {
//         // hack on $scope.$watch to return our spy instead of the usual
//         // so that we can determine if it gets called
//         var _watch = $scope.$watch;
//         spyOn($scope, '$watch').and.callFake(function(varName, callback) {
//             // call the real watch method and store the real off method
//             var _off = _watch.call($scope, varName, callback);
//             // replace it with our 007
//             var offSpy = jasmine.createSpy('off method for $watch').and.callFake(function() {
//                 // call the real off method
//                 _off();
//             });
//             $scope.$watch.$$$offSpy = offSpy;
//             return offSpy;
//         });
//     }
//     var pushCounter = 1;

//     function fakeSnap(data, pri) {
//         return testutils.refSnap(testutils.ref('data/a'), data, pri);
//     }

// });
// describe("accessible $firebaseAuth methods", function() {
//     beforeEach(function() {
//         auth = $firebaseAuth(ref);
//     });

//     result = undefined;
//     failure = undefined;
//     status = null;

//     ref = jasmine.createSpyObj('ref', ['authWithCustomToken', 'authAnonymously', 'authWithPassword',
//         'authWithOAuthPopup', 'authWithOAuthRedirect', 'authWithOAuthToken',
//         'unauth', 'getAuth', 'onAuth', 'offAuth',
//         'createUser', 'changePassword', 'changeEmail', 'removeUser', 'resetPassword'
//     ]);

//     function getArgIndex(callbackName) {
//         //In the firebase API, the completion callback is the second argument for all but a few functions.
//         switch (callbackName) {
//             case 'authAnonymously':
//             case 'onAuth':
//                 return 0;
//             case 'authWithOAuthToken':
//                 return 2;
//             default:
//                 return 1;
//         }
//     }

//     function wrapPromise(promise) {
//         promise.then(function(_result_) {
//             status = 'resolved';
//             result = _result_;
//         }, function(_failure_) {
//             status = 'rejected';
//             failure = _failure_;
//         });
//     }

//     function callback(callbackName, callIndex) {
//         callIndex = callIndex || 0; //assume the first call.
//         var argIndex = getArgIndex(callbackName);
//         return ref[callbackName].calls.argsFor(callIndex)[argIndex];
//     }

//     it('will throw an error if a string is used in place of a Firebase Ref', function() {
//         expect(function() {
//             $firebaseAuth('https://some-firebase.firebaseio.com/');
//         }).toThrow();
//     });

//     describe('$authWithCustomToken', function() {
//         it('passes custom token to underlying method', function() {
//             var options = {
//                 optionA: 'a'
//             };
//             auth.$authWithCustomToken('myToken', options);
//             expect(ref.authWithCustomToken).toHaveBeenCalledWith('myToken', jasmine.any(Function), options);
//         });

//         it('will reject the promise if authentication fails', function() {
//             wrapPromise(auth.$authWithCustomToken('myToken'));
//             callback('authWithCustomToken')('myError');
//             $timeout.flush();
//             expect(failure).toEqual('myError');
//         });

//         it('will resolve the promise upon authentication', function() {
//             wrapPromise(auth.$authWithCustomToken('myToken'));
//             callback('authWithCustomToken')(null, 'myResult');
//             $timeout.flush();
//             expect(result).toEqual('myResult');
//         });
//     });

//     describe('$authAnonymously', function() {
//         it('passes options object to underlying method', function() {
//             var options = {
//                 someOption: 'a'
//             };
//             auth.$authAnonymously(options);
//             expect(ref.authAnonymously).toHaveBeenCalledWith(jasmine.any(Function), {
//                 someOption: 'a'
//             });
//         });

//         it('will reject the promise if authentication fails', function() {
//             wrapPromise(auth.$authAnonymously());
//             callback('authAnonymously')('myError');
//             $timeout.flush();
//             expect(failure).toEqual('myError');
//         });

//         it('will resolve the promise upon authentication', function() {
//             wrapPromise(auth.$authAnonymously());
//             callback('authAnonymously')(null, 'myResult');
//             $timeout.flush();
//             expect(result).toEqual('myResult');
//         });
//     });

//     describe('$authWithPassword', function() {
//         it('passes options and credentials object to underlying method', function() {
//             var options = {
//                 someOption: 'a'
//             };
//             var credentials = {
//                 email: 'myname',
//                 password: 'password'
//             };
//             auth.$authWithPassword(credentials, options);
//             expect(ref.authWithPassword).toHaveBeenCalledWith({
//                     email: 'myname',
//                     password: 'password'
//                 },
//                 jasmine.any(Function), {
//                     someOption: 'a'
//                 }
//             );
//         });

//         it('will revoke the promise if authentication fails', function() {
//             wrapPromise(auth.$authWithPassword());
//             callback('authWithPassword')('myError');
//             $timeout.flush();
//             expect(failure).toEqual('myError');
//         });

//         it('will resolve the promise upon authentication', function() {
//             wrapPromise(auth.$authWithPassword());
//             callback('authWithPassword')(null, 'myResult');
//             $timeout.flush();
//             expect(result).toEqual('myResult');
//         });
//     });

//     describe('$authWithOAuthPopup', function() {
//         it('passes provider and options object to underlying method', function() {
//             var options = {
//                 someOption: 'a'
//             };
//             var provider = 'facebook';
//             auth.$authWithOAuthPopup(provider, options);
//             expect(ref.authWithOAuthPopup).toHaveBeenCalledWith(
//                 'facebook',
//                 jasmine.any(Function), {
//                     someOption: 'a'
//                 }
//             );
//         });

//         it('will reject the promise if authentication fails', function() {
//             wrapPromise(auth.$authWithOAuthPopup());
//             callback('authWithOAuthPopup')('myError');
//             $timeout.flush();
//             expect(failure).toEqual('myError');
//         });

//         it('will resolve the promise upon authentication', function() {
//             wrapPromise(auth.$authWithOAuthPopup());
//             callback('authWithOAuthPopup')(null, 'myResult');
//             $timeout.flush();
//             expect(result).toEqual('myResult');
//         });
//     });

//     describe('$authWithOAuthRedirect', function() {
//         it('passes provider and options object to underlying method', function() {
//             var provider = 'facebook';
//             var options = {
//                 someOption: 'a'
//             };
//             auth.$authWithOAuthRedirect(provider, options);
//             expect(ref.authWithOAuthRedirect).toHaveBeenCalledWith(
//                 'facebook',
//                 jasmine.any(Function), {
//                     someOption: 'a'
//                 }
//             );
//         });

//         it('will reject the promise if authentication fails', function() {
//             wrapPromise(auth.$authWithOAuthRedirect());
//             callback('authWithOAuthRedirect')('myError');
//             $timeout.flush();
//             expect(failure).toEqual('myError');
//         });

//         it('will resolve the promise upon authentication', function() {
//             wrapPromise(auth.$authWithOAuthRedirect());
//             callback('authWithOAuthRedirect')(null, 'myResult');
//             $timeout.flush();
//             expect(result).toEqual('myResult');
//         });
//     });

//     describe('$authWithOAuthToken', function() {
//         it('passes provider, token, and options object to underlying method', function() {
//             var provider = 'facebook';
//             var token = 'FACEBOOK TOKEN';
//             var options = {
//                 someOption: 'a'
//             };
//             auth.$authWithOAuthToken(provider, token, options);
//             expect(ref.authWithOAuthToken).toHaveBeenCalledWith(
//                 'facebook',
//                 'FACEBOOK TOKEN',
//                 jasmine.any(Function), {
//                     someOption: 'a'
//                 }
//             );
//         });

//         it('passes provider, OAuth credentials, and options object to underlying method', function() {
//             var provider = 'twitter';
//             var oauth_credentials = {
//                 "user_id": "<USER-ID>",
//                 "oauth_token": "<ACCESS-TOKEN>",
//                 "oauth_token_secret": "<ACCESS-TOKEN-SECRET>"
//             };
//             var options = {
//                 someOption: 'a'
//             };
//             auth.$authWithOAuthToken(provider, oauth_credentials, options);
//             expect(ref.authWithOAuthToken).toHaveBeenCalledWith(
//                 'twitter',
//                 oauth_credentials,
//                 jasmine.any(Function), {
//                     someOption: 'a'
//                 }
//             );
//         });

//         it('will reject the promise if authentication fails', function() {
//             wrapPromise(auth.$authWithOAuthToken());
//             callback('authWithOAuthToken')('myError');
//             $timeout.flush();
//             expect(failure).toEqual('myError');
//         });

//         it('will resolve the promise upon authentication', function() {
//             wrapPromise(auth.$authWithOAuthToken());
//             callback('authWithOAuthToken')(null, 'myResult');
//             $timeout.flush();
//             expect(result).toEqual('myResult');
//         });
//     });

//     describe('$getAuth()', function() {
//         it('returns getAuth() from backing ref', function() {
//             ref.getAuth.and.returnValue({
//                 provider: 'facebook'
//             });
//             expect(auth.$getAuth()).toEqual({
//                 provider: 'facebook'
//             });
//             ref.getAuth.and.returnValue({
//                 provider: 'twitter'
//             });
//             expect(auth.$getAuth()).toEqual({
//                 provider: 'twitter'
//             });
//             ref.getAuth.and.returnValue(null);
//             expect(auth.$getAuth()).toEqual(null);
//         });
//     });

//     describe('$unauth()', function() {
//         it('will call unauth() on the backing ref if logged in', function() {
//             ref.getAuth.and.returnValue({
//                 provider: 'facebook'
//             });
//             auth.$unauth();
//             expect(ref.unauth).toHaveBeenCalled();
//         });

//         it('will NOT call unauth() on the backing ref if NOT logged in', function() {
//             ref.getAuth.and.returnValue(null);
//             auth.$unauth();
//             expect(ref.unauth).not.toHaveBeenCalled();
//         });
//     });

//     describe('$onAuth()', function() {
//         //todo add more testing here after mockfirebase v2 auth is released

//         it('calls onAuth() on the backing ref', function() {
//             function cb() {}
//             var ctx = {};
//             auth.$onAuth(cb, ctx);
//             expect(ref.onAuth).toHaveBeenCalledWith(jasmine.any(Function));
//         });

//         it('returns a deregistration function that calls offAuth() on the backing ref', function() {
//             function cb() {}
//             var ctx = {};
//             var deregister = auth.$onAuth(cb, ctx);
//             deregister();
//             expect(ref.offAuth).toHaveBeenCalledWith(jasmine.any(Function));
//         });
//     });

//     describe('$requireAuth()', function() {
//         it('will be resolved if user is logged in', function() {
//             ref.getAuth.and.returnValue({
//                 provider: 'facebook'
//             });
//             wrapPromise(auth.$requireAuth());
//             callback('onAuth')();
//             $timeout.flush();
//             expect(result).toEqual({
//                 provider: 'facebook'
//             });
//         });

//         it('will be rejected if user is not logged in', function() {
//             ref.getAuth.and.returnValue(null);
//             wrapPromise(auth.$requireAuth());
//             callback('onAuth')();
//             $timeout.flush();
//             expect(failure).toBe('AUTH_REQUIRED');
//         });
//     });

//     describe('$waitForAuth()', function() {
//         it('will be resolved with authData if user is logged in', function() {
//             ref.getAuth.and.returnValue({
//                 provider: 'facebook'
//             });
//             wrapPromise(auth.$waitForAuth());
//             callback('onAuth')();
//             $timeout.flush();
//             expect(result).toEqual({
//                 provider: 'facebook'
//             });
//         });

//         it('will be resolved with null if user is not logged in', function() {
//             ref.getAuth.and.returnValue(null);
//             wrapPromise(auth.$waitForAuth());
//             callback('onAuth')();
//             $timeout.flush();
//             expect(result).toBe(null);
//         });

//         it('promise resolves with current value if auth state changes after onAuth() completes', function() {
//             ref.getAuth.and.returnValue({
//                 provider: 'facebook'
//             });
//             wrapPromise(auth.$waitForAuth());
//             callback('onAuth')();
//             $timeout.flush();
//             expect(result).toEqual({
//                 provider: 'facebook'
//             });

//             ref.getAuth.and.returnValue(null);
//             wrapPromise(auth.$waitForAuth());
//             $timeout.flush();
//             expect(result).toBe(null);
//         });
//     });

//     describe('$createUser()', function() {
//         it('passes email/password to method on backing ref', function() {
//             auth.$createUser({
//                 email: 'somebody@somewhere.com',
//                 password: '12345'
//             });
//             expect(ref.createUser).toHaveBeenCalledWith({
//                     email: 'somebody@somewhere.com',
//                     password: '12345'
//                 },
//                 jasmine.any(Function));
//         });

//         it('throws error given string arguments', function() {
//             expect(function() {
//                 auth.$createUser('somebody@somewhere.com', '12345');
//             }).toThrow();
//         });

//         it('will reject the promise if creation fails', function() {
//             wrapPromise(auth.$createUser({
//                 email: 'dark@helmet.com',
//                 password: '12345'
//             }));
//             callback('createUser')("I've got the same combination on my luggage");
//             $timeout.flush();
//             expect(failure).toEqual("I've got the same combination on my luggage");
//         });

//         it('will resolve the promise upon creation', function() {
//             wrapPromise(auth.$createUser({
//                 email: 'somebody@somewhere.com',
//                 password: '12345'
//             }));
//             callback('createUser')(null);
//             $timeout.flush();
//             expect(status).toEqual('resolved');
//         });

//         it('promise will resolve with the uid of the user', function() {
//             wrapPromise(auth.$createUser({
//                 email: 'captreynolds@serenity.com',
//                 password: '12345'
//             }));
//             callback('createUser')(null, {
//                 uid: '1234'
//             });
//             $timeout.flush();
//             expect(result).toEqual({
//                 uid: '1234'
//             });
//         });
//     });

//     describe('$changePassword()', function() {
//         it('passes credentials to method on backing ref', function() {
//             auth.$changePassword({
//                 email: 'somebody@somewhere.com',
//                 oldPassword: '54321',
//                 newPassword: '12345'
//             });
//             expect(ref.changePassword).toHaveBeenCalledWith({
//                 email: 'somebody@somewhere.com',
//                 oldPassword: '54321',
//                 newPassword: '12345'
//             }, jasmine.any(Function));
//         });

//         it('throws error given string arguments', function() {
//             expect(function() {
//                 auth.$changePassword('somebody@somewhere.com', '54321', '12345');
//             }).toThrow();
//         });

//         it('will reject the promise if the password change fails', function() {
//             wrapPromise(auth.$changePassword({
//                 email: 'somebody@somewhere.com',
//                 oldPassword: '54321',
//                 newPassword: '12345'
//             }));
//             callback('changePassword')("bad password");
//             $timeout.flush();
//             expect(failure).toEqual("bad password");
//         });

//         it('will resolve the promise upon the password change', function() {
//             wrapPromise(auth.$changePassword({
//                 email: 'somebody@somewhere.com',
//                 oldPassword: '54321',
//                 newPassword: '12345'
//             }));
//             callback('changePassword')(null);
//             $timeout.flush();
//             expect(status).toEqual('resolved');
//         });
//     });

//     describe('$changeEmail()', function() {
//         it('passes credentials to method on backing reference', function() {
//             auth.$changeEmail({
//                 oldEmail: 'somebody@somewhere.com',
//                 newEmail: 'otherperson@somewhere.com',
//                 password: '12345'
//             });
//             expect(ref.changeEmail).toHaveBeenCalledWith({
//                 oldEmail: 'somebody@somewhere.com',
//                 newEmail: 'otherperson@somewhere.com',
//                 password: '12345'
//             }, jasmine.any(Function));
//         });

//         it('will reject the promise if the email change fails', function() {
//             wrapPromise(auth.$changeEmail({
//                 oldEmail: 'somebody@somewhere.com',
//                 newEmail: 'otherperson@somewhere.com',
//                 password: '12345'
//             }));
//             callback('changeEmail')("bad password");
//             $timeout.flush();
//             expect(failure).toEqual("bad password");
//         });

//         it('will resolve the promise upon the email change', function() {
//             wrapPromise(auth.$changeEmail({
//                 oldEmail: 'somebody@somewhere.com',
//                 newEmail: 'otherperson@somewhere.com',
//                 password: '12345'
//             }));
//             callback('changeEmail')(null);
//             $timeout.flush();
//             expect(status).toEqual('resolved');
//         });
//     });

//     describe('$removeUser()', function() {
//         it('passes email/password to method on backing ref', function() {
//             auth.$removeUser({
//                 email: 'somebody@somewhere.com',
//                 password: '12345'
//             });
//             expect(ref.removeUser).toHaveBeenCalledWith({
//                     email: 'somebody@somewhere.com',
//                     password: '12345'
//                 },
//                 jasmine.any(Function));
//         });

//         it('throws error given string arguments', function() {
//             expect(function() {
//                 auth.$removeUser('somebody@somewhere.com', '12345');
//             }).toThrow();
//         });

//         it('will reject the promise if there is an error', function() {
//             wrapPromise(auth.$removeUser({
//                 email: 'somebody@somewhere.com',
//                 password: '12345'
//             }));
//             callback('removeUser')("bad password");
//             $timeout.flush();
//             expect(failure).toEqual("bad password");
//         });

//         it('will resolve the promise upon removal', function() {
//             wrapPromise(auth.$removeUser({
//                 email: 'somebody@somewhere.com',
//                 password: '12345'
//             }));
//             callback('removeUser')(null);
//             $timeout.flush();
//             expect(status).toEqual('resolved');
//         });
//     });

//     describe('$resetPassword()', function() {
//         it('passes email to method on backing ref', function() {
//             auth.$resetPassword({
//                 email: 'somebody@somewhere.com'
//             });
//             expect(ref.resetPassword).toHaveBeenCalledWith({
//                     email: 'somebody@somewhere.com'
//                 },
//                 jasmine.any(Function));
//         });

//         it('throws error given string arguments', function() {
//             expect(function() {
//                 auth.$resetPassword('somebody@somewhere.com');
//             }).toThrow();
//         });

//         it('will reject the promise if reset action fails', function() {
//             wrapPromise(auth.$resetPassword({
//                 email: 'somebody@somewhere.com'
//             }));
//             callback('resetPassword')("user not found");
//             $timeout.flush();
//             expect(failure).toEqual("user not found");
//         });

//         it('will resolve the promise upon success', function() {
//             wrapPromise(auth.$resetPassword({
//                 email: 'somebody@somewhere.com'
//             }));
//             callback('resetPassword')(null);
//             $timeout.flush();
//             expect(status).toEqual('resolved');
//         });
//     });
// });
// describe("$firebaseArray accessible methods", function() {
//     function stubRef() {
//         return new MockFirebase('Mock://').child('data/REC1');
//     }

//     function stubArray(initialData, Factory, ref) {
//         if (!Factory) {
//             Factory = afEntity.set('array',ref);
//         }
//         if (!ref) {
//             ref = stubRef();
//         }
//         var arr = new Factory(ref);
//         if (initialData) {
//             ref.set(initialData);
//             ref.flush();
//             flushAll();
//         }
//         return arr;
//     }
//     var STUB_DATA = {
//         'a': {
//             aString: 'alpha',
//             aNumber: 1,
//             aBoolean: false
//         },
//         'b': {
//             aString: 'bravo',
//             aNumber: 2,
//             aBoolean: true
//         },
//         'c': {
//             aString: 'charlie',
//             aNumber: 3,
//             aBoolean: true
//         },
//         'd': {
//             aString: 'delta',
//             aNumber: 4,
//             aBoolean: true
//         },
//         'e': {
//             aString: 'echo',
//             aNumber: 5
//         }
//     };

//     beforeEach(function() {
//         arr = stubArray(STUB_DATA);
//     });
//     describe('<constructor>', function() {
//         beforeEach(function() {
//             inject(function($firebaseUtils, $firebaseArray) {
//                 this.$utils = $firebaseUtils;
//                 this.$firebaseArray = $firebaseArray;
//             });
//         });

//         it('should return a valid array', function() {
//             expect(Array.isArray(arr)).toBe(true);
//         });

//         it('should have API methods', function() {
//             var i = 0;
//             this.$utils.getPublicMethods($firebaseArray, function(v, k) {
//                 expect(typeof arr[k]).toBe('function');
//                 i++;
//             });
//             expect(i).toBeGreaterThan(0);
//         });
//     });

//     describe('$add', function() {
//         it('should call $push on $firebase', function() {
//             var spy = spyOn(arr.$ref(), 'push').and.callThrough();
//             var data = {
//                 foo: 'bar'
//             };
//             arr.$add(data);
//             expect(spy).toHaveBeenCalled();
//         });

//         it('should return a promise', function() {
//             expect(arr.$add({
//                 foo: 'bar'
//             })).toBeAPromise();
//         });

//         it('should resolve to ref for new record', function() {
//             var spy = jasmine.createSpy();
//             arr.$add({
//                 foo: 'bar'
//             }).then(spy);
//             flushAll(arr.$ref());
//             var lastId = arr.$ref()._lastAutoId;
//             expect(spy).toHaveBeenCalledWith(arr.$ref().child(lastId));
//         });

//         it('should wait for promise resolution to update array', function() {
//             var queue = [];

//             function addPromise(snap, prevChild) {
//                 return new $utils.promise(
//                     function(resolve) {
//                         queue.push(resolve);
//                     }).then(function(name) {
//                     var data = $firebaseArray.prototype.$$added.call(arr, snap, prevChild);
//                     data.name = name;
//                     return data;
//                 });
//             }
//             arr = stubArray(null, $firebaseArray.$extend({
//                 $$added: addPromise
//             }));
//             expect(arr.length).toBe(0);
//             arr.$add({
//                 userId: '1234'
//             });
//             flushAll(arr.$ref());
//             expect(arr.length).toBe(0);
//             expect(queue.length).toBe(1);
//             queue[0]('James');
//             $timeout.flush();
//             expect(arr.length).toBe(1);
//             expect(arr[0].name).toBe('James');
//         });

//         it('should wait to resolve $loaded until $$added promise is resolved', function() {
//             var queue = [];

//             function addPromise(snap, prevChild) {
//                 return new $utils.promise(
//                     function(resolve) {
//                         queue.push(resolve);
//                     }).then(function(name) {
//                     var data = $firebaseArray.prototype.$$added.call(arr, snap, prevChild);
//                     data.name = name;
//                     return data;
//                 });
//             }
//             var called = false;
//             var ref = stubRef();
//             arr = stubArray(null, $firebaseArray.$extend({
//                 $$added: addPromise
//             }), ref);
//             arr.$loaded().then(function() {
//                 expect(arr.length).toBe(1);
//                 called = true;
//             });
//             ref.set({
//                 '-Jwgx': {
//                     username: 'James',
//                     email: 'james@internet.com'
//                 }
//             });
//             ref.flush();
//             $timeout.flush();
//             queue[0]('James');
//             $timeout.flush();
//             expect(called, 'called').toBe(true);
//         });


//         it('should reject promise on fail', function() {
//             var successSpy = jasmine.createSpy('resolve spy');
//             var errSpy = jasmine.createSpy('reject spy');
//             var err = new Error('fail_push');
//             arr.$ref().failNext('push', err);
//             arr.$add('its deed').then(successSpy, errSpy);
//             flushAll(arr.$ref());
//             expect(successSpy).not.toHaveBeenCalled();
//             expect(errSpy).toHaveBeenCalledWith(err);
//         });

//         it('should work with a primitive value', function() {
//             var spyPush = spyOn(arr.$ref(), 'push').and.callThrough();
//             var spy = jasmine.createSpy('$add').and.callFake(function(ref) {
//                 expect(arr.$ref().child(ref.key()).getData()).toEqual('hello');
//             });
//             arr.$add('hello').then(spy);
//             flushAll(arr.$ref());
//             expect(spyPush).toHaveBeenCalled();
//             expect(spy).toHaveBeenCalled();
//         });

//         it('should throw error if array is destroyed', function() {
//             arr.$destroy();
//             expect(function() {
//                 arr.$add({
//                     foo: 'bar'
//                 });
//             }).toThrowError(Error);
//         });

//         it('should store priorities', function() {
//             var arr = stubArray();
//             addAndProcess(arr, testutils.snap('one', 'b', 1), null);
//             addAndProcess(arr, testutils.snap('two', 'a', 2), 'b');
//             addAndProcess(arr, testutils.snap('three', 'd', 3), 'd');
//             addAndProcess(arr, testutils.snap('four', 'c', 4), 'c');
//             addAndProcess(arr, testutils.snap('five', 'e', 5), 'e');
//             expect(arr.length).toBe(5);
//             for (var i = 1; i <= 5; i++) {
//                 expect(arr[i - 1].$priority).toBe(i);
//             }
//         });

//         it('should observe $priority and $value meta keys if present', function() {
//             var spy = jasmine.createSpy('$add').and.callFake(function(ref) {
//                 expect(ref.priority).toBe(99);
//                 expect(ref.getData()).toBe('foo');
//             });
//             var arr = stubArray();
//             arr.$add({
//                 $value: 'foo',
//                 $priority: 99
//             }).then(spy);
//             flushAll(arr.$ref());
//             expect(spy).toHaveBeenCalled();
//         });

//         it('should work on a query', function() {
//             var ref = stubRef();
//             var query = ref.limit(2);
//             var arr = $firebaseArray(query);
//             addAndProcess(arr, testutils.snap('one', 'b', 1), null);
//             expect(arr.length).toBe(1);
//         });
//     });

//     describe('$save', function() {
//         it('should accept an array index', function() {
//             var key = arr.$keyAt(2);
//             var spy = spyOn(arr.$ref().child(key), 'set');
//             arr[2].number = 99;
//             arr.$save(2);
//             var expResult = $utils.toJSON(arr[2]);
//             expect(spy).toHaveBeenCalledWith(expResult, jasmine.any(Function));
//         });

//         it('should accept an item from the array', function() {
//             var key = arr.$keyAt(2);
//             var spy = spyOn(arr.$ref().child(key), 'set');
//             arr[2].number = 99;
//             arr.$save(arr[2]);
//             var expResult = $utils.toJSON(arr[2]);
//             expect(spy).toHaveBeenCalledWith(expResult, jasmine.any(Function));
//         });

//         it('should return a promise', function() {
//             expect(arr.$save(1)).toBeAPromise();
//         });

//         it('should resolve promise on sync', function() {
//             var spy = jasmine.createSpy();
//             arr.$save(1).then(spy);
//             expect(spy).not.toHaveBeenCalled();
//             flushAll(arr.$ref());
//             expect(spy).toHaveBeenCalled();
//         });

//         it('should reject promise on failure', function() {
//             var key = arr.$keyAt(1);
//             var err = new Error('test_reject');
//             arr.$ref().child(key).failNext('set', err);
//             var whiteSpy = jasmine.createSpy('resolve');
//             var blackSpy = jasmine.createSpy('reject');
//             arr.$save(1).then(whiteSpy, blackSpy);
//             flushAll(arr.$ref());
//             expect(whiteSpy).not.toHaveBeenCalled();
//             expect(blackSpy).toHaveBeenCalledWith(err);
//         });

//         it('should reject promise on bad index', function() {
//             var whiteSpy = jasmine.createSpy('resolve');
//             var blackSpy = jasmine.createSpy('reject');
//             arr.$save(99).then(whiteSpy, blackSpy);
//             flushAll();
//             expect(whiteSpy).not.toHaveBeenCalled();
//             expect(blackSpy.calls.argsFor(0)[0]).toMatch(/invalid/i);
//         });

//         it('should reject promise on bad object', function() {
//             var whiteSpy = jasmine.createSpy('resolve');
//             var blackSpy = jasmine.createSpy('reject');
//             arr.$save({
//                 foo: 'baz'
//             }).then(whiteSpy, blackSpy);
//             flushAll();
//             expect(whiteSpy).not.toHaveBeenCalled();
//             expect(blackSpy.calls.argsFor(0)[0]).toMatch(/invalid/i);
//         });

//         it('should accept a primitive', function() {
//             var key = arr.$keyAt(1);
//             var ref = arr.$ref().child(key);
//             arr[1] = {
//                 $value: 'happy',
//                 $id: key
//             };
//             arr.$save(1);
//             flushAll(ref);
//             expect(ref.getData()).toBe('happy');
//         });

//         it('should throw error if object is destroyed', function() {
//             arr.$destroy();
//             expect(function() {
//                 arr.$save(0);
//             }).toThrowError(Error);
//         });

//         it('should trigger watch event', function() {
//             var spy = jasmine.createSpy('$watch');
//             arr.$watch(spy);
//             var key = arr.$keyAt(1);
//             arr[1].foo = 'watchtest';
//             arr.$save(1);
//             flushAll(arr.$ref());
//             expect(spy).toHaveBeenCalledWith(jasmine.objectContaining({
//                 event: 'child_changed',
//                 key: key
//             }));
//         });

//         it('should work on a query', function() {
//             var whiteSpy = jasmine.createSpy('resolve');
//             var blackSpy = jasmine.createSpy('reject').and.callFake(function(e) {
//                 console.error(e);
//             });
//             var ref = stubRef();
//             ref.set(STUB_DATA);
//             ref.flush();
//             var query = ref.limit(5);
//             var arr = $firebaseArray(query);
//             flushAll(arr.$ref());
//             var key = arr.$keyAt(1);
//             arr[1].foo = 'watchtest';
//             arr.$save(1).then(whiteSpy, blackSpy);
//             flushAll(arr.$ref());
//             expect(whiteSpy).toHaveBeenCalled();
//             expect(blackSpy).not.toHaveBeenCalled();
//         });
//     });

//     describe('$remove', function() {
//         it('should call remove on Firebase ref', function() {
//             var key = arr.$keyAt(1);
//             var spy = spyOn(arr.$ref().child(key), 'remove');
//             arr.$remove(1);
//             expect(spy).toHaveBeenCalled();
//         });

//         it('should return a promise', function() {
//             expect(arr.$remove(1)).toBeAPromise();
//         });

//         it('should resolve promise to ref on success', function() {
//             var whiteSpy = jasmine.createSpy('resolve');
//             var blackSpy = jasmine.createSpy('reject');
//             var expName = arr.$keyAt(1);
//             arr.$remove(1).then(whiteSpy, blackSpy);
//             flushAll(arr.$ref());
//             var resRef = whiteSpy.calls.argsFor(0)[0];
//             expect(whiteSpy).toHaveBeenCalled();
//             expect(resRef).toBeAFirebaseRef();
//             expect(resRef.key()).toBe(expName);
//             expect(blackSpy).not.toHaveBeenCalled();
//         });

//         it('should reject promise on failure', function() {
//             var whiteSpy = jasmine.createSpy('resolve');
//             var blackSpy = jasmine.createSpy('reject');
//             var key = arr.$keyAt(1);
//             var err = new Error('fail_remove');
//             arr.$ref().child(key).failNext('remove', err);
//             arr.$remove(1).then(whiteSpy, blackSpy);
//             flushAll(arr.$ref());
//             expect(whiteSpy).not.toHaveBeenCalled();
//             expect(blackSpy).toHaveBeenCalledWith(err);
//         });

//         it('should reject promise if bad int', function() {
//             var whiteSpy = jasmine.createSpy('resolve');
//             var blackSpy = jasmine.createSpy('reject');
//             arr.$remove(-99).then(whiteSpy, blackSpy);
//             flushAll();
//             expect(whiteSpy).not.toHaveBeenCalled();
//             expect(blackSpy.calls.argsFor(0)[0]).toMatch(/invalid/i);
//         });

//         it('should reject promise if bad object', function() {
//             var whiteSpy = jasmine.createSpy('resolve');
//             var blackSpy = jasmine.createSpy('reject');
//             arr.$remove({
//                 foo: false
//             }).then(whiteSpy, blackSpy);
//             flushAll();
//             expect(whiteSpy).not.toHaveBeenCalled();
//             expect(blackSpy.calls.argsFor(0)[0]).toMatch(/invalid/i);
//         });

//         it('should work on a query', function() {
//             var ref = stubRef();
//             ref.set(STUB_DATA);
//             ref.flush();
//             var whiteSpy = jasmine.createSpy('resolve');
//             var blackSpy = jasmine.createSpy('reject').and.callFake(function(e) {
//                 console.error(e);
//             });
//             var query = ref.limit(5); //todo-mock MockFirebase does not support 2.x queries yet
//             var arr = $firebaseArray(query);
//             flushAll(arr.$ref());
//             var key = arr.$keyAt(1);
//             arr.$remove(1).then(whiteSpy, blackSpy);
//             flushAll(arr.$ref());
//             expect(whiteSpy).toHaveBeenCalled();
//             expect(blackSpy).not.toHaveBeenCalled();
//         });

//         it('should throw Error if array destroyed', function() {
//             arr.$destroy();
//             expect(function() {
//                 arr.$remove(0);
//             }).toThrowError(Error);
//         });
//     });

//     describe('$keyAt', function() {
//         it('should return key for an integer', function() {
//             expect(arr.$keyAt(2)).toBe('c');
//         });

//         it('should return key for an object', function() {
//             expect(arr.$keyAt(arr[2])).toBe('c');
//         });

//         it('should return null if invalid object', function() {
//             expect(arr.$keyAt({
//                 foo: false
//             })).toBe(null);
//         });

//         it('should return null if invalid integer', function() {
//             expect(arr.$keyAt(-99)).toBe(null);
//         });
//     });

//     describe('$indexFor', function() {
//         it('should return integer for valid key', function() {
//             expect(arr.$indexFor('c')).toBe(2);
//         });

//         it('should return -1 for invalid key', function() {
//             expect(arr.$indexFor('notarealkey')).toBe(-1);
//         });

//         it('should not show up after removing the item', function() {
//             var rec = arr.$getRecord('b');
//             expect(rec).not.toBe(null);
//             arr.$$removed(testutils.refSnap(testutils.ref('b')));
//             arr.$$process('child_removed', rec);
//             expect(arr.$indexFor('b')).toBe(-1);
//         });
//     });

//     describe('$loaded', function() {
//         it('should return a promise', function() {
//             expect(arr.$loaded()).toBeAPromise();
//         });

//         it('should resolve when values are received', function() {
//             var arr = stubArray();
//             var whiteSpy = jasmine.createSpy('resolve');
//             var blackSpy = jasmine.createSpy('reject');
//             arr.$loaded().then(whiteSpy, blackSpy);
//             flushAll();
//             expect(whiteSpy).not.toHaveBeenCalled();
//             flushAll(arr.$ref());
//             expect(whiteSpy).toHaveBeenCalled();
//             expect(blackSpy).not.toHaveBeenCalled();
//         });

//         it('should resolve to the array', function() {
//             var spy = jasmine.createSpy('resolve');
//             arr.$loaded().then(spy);
//             flushAll();
//             expect(spy).toHaveBeenCalledWith(arr);
//         });

//         it('should have all data loaded when it resolves', function() {
//             var spy = jasmine.createSpy('resolve');
//             arr.$loaded().then(spy);
//             flushAll();
//             var list = spy.calls.argsFor(0)[0];
//             expect(list.length).toBe(5);
//         });

//         it('should reject when error fetching records', function() {
//             var whiteSpy = jasmine.createSpy('resolve');
//             var blackSpy = jasmine.createSpy('reject');
//             var err = new Error('test_fail');
//             var ref = stubRef();
//             ref.failNext('on', err);
//             var arr = $firebaseArray(ref);
//             arr.$loaded().then(whiteSpy, blackSpy);
//             flushAll(ref);
//             expect(whiteSpy).not.toHaveBeenCalled();
//             expect(blackSpy).toHaveBeenCalledWith(err);
//         });

//         it('should resolve if function passed directly into $loaded', function() {
//             var spy = jasmine.createSpy('resolve');
//             arr.$loaded(spy);
//             flushAll();
//             expect(spy).toHaveBeenCalledWith(arr);
//         });

//         it('should reject properly when function passed directly into $loaded', function() {
//             var whiteSpy = jasmine.createSpy('resolve');
//             var blackSpy = jasmine.createSpy('reject');
//             var ref = stubRef();
//             var err = new Error('test_fail');
//             ref.failNext('once', err);
//             var arr = $firebaseArray(ref);
//             arr.$loaded(whiteSpy, blackSpy);
//             flushAll(ref);
//             expect(whiteSpy).not.toHaveBeenCalled();
//             expect(blackSpy).toHaveBeenCalledWith(err);
//         });
//     });

//     describe('$ref', function() {
//         it('should return Firebase instance it was created with', function() {
//             var ref = stubRef();
//             var arr = $firebaseArray(ref);
//             expect(arr.$ref()).toBe(ref);
//         });
//     });

//     describe('$watch', function() {
//         it('should get notified when $$notify is called', function() {
//             var spy = jasmine.createSpy('$watch');
//             arr.$watch(spy);
//             arr.$$notify('child_removed', 'removedkey123', 'prevkey456');
//             expect(spy).toHaveBeenCalledWith({
//                 event: 'child_removed',
//                 key: 'removedkey123',
//                 prevChild: 'prevkey456'
//             });
//         });

//         it('should return a dispose function', function() {
//             expect(arr.$watch(function() {})).toBeA('function');
//         });

//         it('should not get notified after dispose function is called', function() {
//             var spy = jasmine.createSpy('$watch');
//             var off = arr.$watch(spy);
//             off();
//             arr.$$notify('child_removed', 'removedkey123', 'prevkey456');
//             expect(spy).not.toHaveBeenCalled();
//         });

//         it('calling the deregistration function twice should be silently ignored', function() {
//             var spy = jasmine.createSpy('$watch');
//             var off = arr.$watch(spy);
//             off();
//             off();
//             arr.$$notify('child_removed', 'removedkey123', 'prevkey456');
//             expect(spy).not.toHaveBeenCalled();
//         });
//     });

//     describe('$destroy', function() {
//         it('should call off on ref', function() {
//             var spy = spyOn(arr.$ref(), 'off');
//             arr.$destroy();
//             expect(spy).toHaveBeenCalled();
//         });

//         it('should empty the array', function() {
//             expect(arr.length).toBeGreaterThan(0);
//             arr.$destroy();
//             expect(arr.length).toBe(0);
//         });

//         it('should reject $loaded() if not completed yet', function() {
//             var whiteSpy = jasmine.createSpy('resolve');
//             var blackSpy = jasmine.createSpy('reject');
//             var arr = stubArray();
//             arr.$loaded().then(whiteSpy, blackSpy);
//             arr.$destroy();
//             flushAll(arr.$ref());
//             expect(whiteSpy).not.toHaveBeenCalled();
//             expect(blackSpy.calls.argsFor(0)[0]).toMatch(/destroyed/i);
//         });
//     });

//     describe('$$added', function() {
//         it('should return an object', function() {
//             var snap = testutils.snap({
//                 foo: 'bar'
//             }, 'newObj');
//             var res = arr.$$added(snap);
//             expect(res).toEqual(jasmine.objectContaining({
//                 foo: 'bar'
//             }));
//         });

//         it('should return false if key already exists', function() {
//             var snap = testutils.snap({
//                 foo: 'bar'
//             }, 'a');
//             var res = arr.$$added(snap);
//             expect(res).toBe(false);
//         });

//         it('should accept a primitive', function() {
//             var res = arr.$$added(testutils.snap(true, 'newPrimitive'), null);
//             expect(res.$value).toBe(true);
//         });

//         it('should apply $$defaults if they exist', function() {
//             var arr = stubArray(null, $firebaseArray.$extend({
//                 $$defaults: {
//                     aString: 'not_applied',
//                     foo: 'foo'
//                 }
//             }));
//             var res = arr.$$added(testutils.snap(STUB_DATA.a));
//             expect(res.aString).toBe(STUB_DATA.a.aString);
//             expect(res.foo).toBe('foo');
//         });
//     });

//     describe('$$updated', function() {
//         it('should return true if data changes', function() {
//             var res = arr.$$updated(testutils.snap('foo', 'b'));
//             expect(res).toBe(true);
//         });

//         it('should return false if data does not change', function() {
//             var i = arr.$indexFor('b');
//             var res = arr.$$updated(testutils.snap(arr[i], 'b'));
//             expect(res).toBe(false);
//         });

//         it('should update local data', function() {
//             var i = arr.$indexFor('b');
//             expect(i).toBeGreaterThan(-1);
//             arr.$$updated(testutils.snap('foo', 'b'));
//             expect(arr[i]).toEqual(jasmine.objectContaining({
//                 '$value': 'foo'
//             }));
//         });

//         it('should ignore if not found', function() {
//             var len = arr.length;
//             expect(len).toBeGreaterThan(0);
//             var copy = testutils.deepCopyObject(arr);
//             arr.$$updated(testutils.snap('foo', 'notarealkey'));
//             expect(len).toEqual(copy.length);
//             for (var i = 0; i < len; i++) {
//                 expect(arr[i]).toEqual(copy[i]);
//             }
//         });

//         it('should preserve ids', function() {
//             var pos = arr.$indexFor('b');
//             expect(pos).toBeGreaterThan(-1);
//             arr.$$updated(testutils.snap({
//                 foo: 'bar'
//             }, 'b'));
//             expect(arr[pos].$id).toBe('b');
//         });

//         it('should set priorities', function() {
//             var pos = arr.$indexFor('b');
//             expect(pos).toBeGreaterThan(-1);
//             arr.$$updated(testutils.snap({
//                 foo: 'bar'
//             }, 'b', 250));
//             expect(arr[pos].$priority).toBe(250);
//         });

//         it('should apply $$defaults if they exist', function() {
//             var arr = stubArray(STUB_DATA, $firebaseArray.$extend({
//                 $$defaults: {
//                     aString: 'not_applied',
//                     foo: 'foo'
//                 }
//             }));
//             var rec = arr.$getRecord('a');
//             expect(rec.aString).toBe(STUB_DATA.a.aString);
//             expect(rec.foo).toBe('foo');
//             delete rec.foo;
//             arr.$$updated(testutils.snap($utils.toJSON(rec), 'a'));
//             expect(rec.aString).toBe(STUB_DATA.a.aString);
//             expect(rec.foo).toBe('foo');
//         });
//     });

//     describe('$$moved', function() {
//         it('should set $priority', function() {
//             var rec = arr.$getRecord('c');
//             expect(rec.$priority).not.toBe(999);
//             arr.$$moved(testutils.snap($utils.toJSON(rec), 'c', 999), 'd');
//             expect(rec.$priority).toBe(999);
//         });

//         it('should return true if record exists', function() {
//             var rec = arr.$getRecord('a');
//             var res = arr.$$moved(testutils.snap($utils.toJSON(rec), 'a'), 'c');
//             expect(res).toBe(true);
//         });

//         it('should return false record not found', function() {
//             var res = arr.$$moved(testutils.snap(true, 'notarecord'), 'c');
//             expect(res).toBe(false);
//         });
//     });

//     describe('$$removed', function() {
//         it('should return true if exists in data', function() {
//             var res = arr.$$removed(testutils.snap(null, 'e'));
//             expect(res).toBe(true);
//         });

//         it('should return false if does not exist in data', function() {
//             var res = arr.$$removed(testutils.snap(null, 'notarecord'));
//             expect(res).toBe(false);
//         });
//     });

//     describe('$$error', function() {
//         it('should call $destroy', function() {
//             var spy = jasmine.createSpy('$destroy');
//             var arr = stubArray(STUB_DATA, $firebaseArray.$extend({
//                 $destroy: spy
//             }));
//             spy.calls.reset();
//             arr.$$error('test_err');
//             expect(spy).toHaveBeenCalled();
//         });
//     });

//     describe('$$notify', function() {
//         it('should notify $watch listeners', function() {
//             var spy1 = jasmine.createSpy('$watch1');
//             var spy2 = jasmine.createSpy('$watch2');
//             arr.$watch(spy1);
//             arr.$watch(spy2);
//             arr.$$notify('added', 'e', 'd');
//             expect(spy1).toHaveBeenCalled();
//             expect(spy2).toHaveBeenCalled();
//         });

//         it('should pass an object containing key, event, and prevChild if present', function() {
//             var spy = jasmine.createSpy('$watch1');
//             arr.$watch(spy);
//             arr.$$notify('child_added', 'e', 'd');
//             expect(spy).toHaveBeenCalledWith({
//                 event: 'child_added',
//                 key: 'e',
//                 prevChild: 'd'
//             });
//         });
//     });

//     describe('$$process', function() {

//         /////////////// ADD
//         it('should add to local array', function() {
//             var len = arr.length;
//             var rec = arr.$$added(testutils.snap({
//                 hello: 'world'
//             }, 'addz'), 'b');
//             arr.$$process('child_added', rec, 'b');
//             expect(arr.length).toBe(len + 1);
//         });

//         it('should position after prev child', function() {
//             var pos = arr.$indexFor('b');
//             expect(pos).toBeGreaterThan(-1);
//             var rec = arr.$$added(testutils.snap({
//                 hello: 'world'
//             }, 'addAfterB'), 'b');
//             arr.$$process('child_added', rec, 'b');
//             expect(arr.$keyAt(pos + 1)).toBe('addAfterB');
//         });

//         it('should position first if prevChild is null', function() {
//             var rec = arr.$$added(testutils.snap({
//                 hello: 'world'
//             }, 'addFirst'), null);
//             arr.$$process('child_added', rec, null);
//             expect(arr.$keyAt(0)).toBe('addFirst');
//         });

//         it('should position last if prevChild not found', function() {
//             var len = arr.length;
//             var rec = arr.$$added(testutils.snap({
//                 hello: 'world'
//             }, 'addLast'), 'notarealkeyinarray');
//             arr.$$process('child_added', rec, 'notrealkeyinarray');
//             expect(arr.$keyAt(len)).toBe('addLast');
//         });

//         it('should invoke $$notify with "child_added" event', function() {
//             var spy = jasmine.createSpy('$$notify');
//             var arr = stubArray(STUB_DATA, $firebaseArray.$extend({
//                 $$notify: spy
//             }));
//             spy.calls.reset();
//             var rec = arr.$$added(testutils.snap({
//                 hello: 'world'
//             }, 'addFirst'), null);
//             arr.$$process('child_added', rec, null);
//             expect(spy).toHaveBeenCalled();
//         });

//         it('"child_added" should not invoke $$notify if it already exists after prevChild', function() {
//             var spy = jasmine.createSpy('$$notify');
//             var arr = stubArray(STUB_DATA, $firebaseArray.$extend({
//                 $$notify: spy
//             }));
//             var index = arr.$indexFor('e');
//             var prevChild = arr.$$getKey(arr[index - 1]);
//             spy.calls.reset();
//             arr.$$process('child_added', arr.$getRecord('e'), prevChild);
//             expect(spy).not.toHaveBeenCalled();
//         });

//         ///////////////// UPDATE

//         it('should invoke $$notify with "child_changed" event', function() {
//             var spy = jasmine.createSpy('$$notify');
//             var arr = stubArray(STUB_DATA, $firebaseArray.$extend({
//                 $$notify: spy
//             }));
//             spy.calls.reset();
//             arr.$$updated(testutils.snap({
//                 hello: 'world'
//             }, 'a'));
//             arr.$$process('child_changed', arr.$getRecord('a'));
//             expect(spy).toHaveBeenCalled();
//         });

//         ///////////////// MOVE
//         it('should move local record', function() {
//             var b = arr.$indexFor('b');
//             var c = arr.$indexFor('c');
//             arr.$$moved(testutils.refSnap(testutils.ref('b')), 'c');
//             arr.$$process('child_moved', arr.$getRecord('b'), 'c');
//             expect(arr.$indexFor('c')).toBe(b);
//             expect(arr.$indexFor('b')).toBe(c);
//         });

//         it('should position at 0 if prevChild is null', function() {
//             var b = arr.$indexFor('b');
//             expect(b).toBeGreaterThan(0);
//             arr.$$moved(testutils.snap(null, 'b'), null);
//             arr.$$process('child_moved', arr.$getRecord('b'), null);
//             expect(arr.$indexFor('b')).toBe(0);
//         });

//         it('should position at end if prevChild not found', function() {
//             var b = arr.$indexFor('b');
//             expect(b).toBeLessThan(arr.length - 1);
//             arr.$$moved(testutils.refSnap(testutils.ref('b')), 'notarealkey');
//             arr.$$process('child_moved', arr.$getRecord('b'), 'notarealkey');
//             expect(arr.$indexFor('b')).toBe(arr.length - 1);
//         });

//         it('should invoke $$notify with "child_moved" event', function() {
//             var spy = jasmine.createSpy('$$notify');
//             var arr = stubArray(STUB_DATA, $firebaseArray.$extend({
//                 $$notify: spy
//             }));
//             spy.calls.reset();
//             arr.$$moved(testutils.refSnap(testutils.ref('b')), 'notarealkey');
//             arr.$$process('child_moved', arr.$getRecord('b'), 'notarealkey');
//             expect(spy).toHaveBeenCalled();
//         });

//         it('"child_moved" should not trigger $$notify if prevChild is already the previous element', function() {
//             var spy = jasmine.createSpy('$$notify');
//             var arr = stubArray(STUB_DATA, $firebaseArray.$extend({
//                 $$notify: spy
//             }));
//             var index = arr.$indexFor('e');
//             var prevChild = arr.$$getKey(arr[index - 1]);
//             spy.calls.reset();
//             arr.$$process('child_moved', arr.$getRecord('e'), prevChild);
//             expect(spy).not.toHaveBeenCalled();
//         });

//         ///////////////// REMOVE
//         it('should remove from local array', function() {
//             var len = arr.length;
//             expect(arr.$indexFor('b')).toBe(1);
//             arr.$$removed(testutils.refSnap(testutils.ref('b')));
//             arr.$$process('child_removed', arr.$getRecord('b'));
//             expect(arr.length).toBe(len - 1);
//             expect(arr.$indexFor('b')).toBe(-1);
//         });

//         it('should trigger $$notify with "child_removed" event', function() {
//             var spy = jasmine.createSpy('$$notify');
//             var arr = stubArray(STUB_DATA, $firebaseArray.$extend({
//                 $$notify: spy
//             }));
//             spy.calls.reset();
//             arr.$$removed(testutils.refSnap(testutils.ref('e')));
//             arr.$$process('child_removed', arr.$getRecord('e'));
//             expect(spy).toHaveBeenCalled();
//         });

//         it('"child_removed" should not trigger $$notify if the record is not in the array', function() {
//             var spy = jasmine.createSpy('$$notify');
//             var arr = stubArray(STUB_DATA, $firebaseArray.$extend({
//                 $$notify: spy
//             }));
//             spy.calls.reset();
//             arr.$$process('child_removed', {
//                 $id: 'f'
//             });
//             expect(spy).not.toHaveBeenCalled();
//         });

//         //////////////// OTHER
//         it('should throw an error for an unknown event type', function() {
//             var arr = stubArray(STUB_DATA);
//             expect(function() {
//                 arr.$$process('unknown_event', arr.$getRecord('e'));
//             }).toThrow();
//         });

//     });

//     describe('$extend', function() {
//         it('should return a valid array', function() {
//             var F = $firebaseArray.$extend({});
//             expect(Array.isArray(F(stubRef()))).toBe(true);
//         });

//         it('should preserve child prototype', function() {
//             function Extend() {
//                 $firebaseArray.apply(this, arguments);
//             }
//             Extend.prototype.foo = function() {};
//             $firebaseArray.$extend(Extend);
//             var arr = new Extend(stubRef());
//             expect(typeof(arr.foo)).toBe('function');
//         });

//         it('should return child class', function() {
//             function A() {}
//             var res = $firebaseArray.$extend(A);
//             expect(res).toBe(A);
//         });

//         it('should be instanceof $firebaseArray', function() {
//             function A() {}
//             $firebaseArray.$extend(A);
//             expect(new A(stubRef()) instanceof $firebaseArray).toBe(true);
//         });

//         it('should add on methods passed into function', function() {
//             function foo() {
//                 return 'foo';
//             }
//             var F = $firebaseArray.$extend({
//                 foo: foo
//             });
//             var res = F(stubRef());
//             expect(typeof res.$$updated).toBe('function');
//             expect(typeof res.foo).toBe('function');
//             expect(res.foo()).toBe('foo');
//         });

//         it('should work with the new keyword', function() {
//             var fn = function() {};
//             var Res = $firebaseArray.$extend({
//                 foo: fn
//             });
//             expect(new Res(stubRef()).foo).toBeA('function');
//         });

//         it('should work without the new keyword', function() {
//             var fn = function() {};
//             var Res = $firebaseArray.$extend({
//                 foo: fn
//             });
//             expect(Res(stubRef()).foo).toBeA('function');
//         });
//     });

//     var flushAll = (function() {
//         return function flushAll() {
//             // the order of these flush events is significant
//             Array.prototype.slice.call(arguments, 0).forEach(function(o) {
//                 o.flush();
//             });
//             try {
//                 $timeout.flush();
//             } catch (e) {}
//         }
//     })();


//     function addAndProcess(arr, snap, prevChild) {
//         arr.$$process('child_added', arr.$$added(snap, prevChild), prevChild);
//     }


// });
// });
