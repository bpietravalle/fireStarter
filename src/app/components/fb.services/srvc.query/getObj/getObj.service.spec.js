(function() {
    "use strict";
    describe("getObj", function() {
        var getObj, mockObj, obj, ref, $interval, $timeout;
        var FIXTURE_DATA = {
            aString: 'alpha',
            aNumber: 1,
            aBoolean: false,
            anObject: {
                bString: 'bravo'
            }
        };


        beforeEach(function() {
            module('srvc.query');
            module("fbMocks");
            inject(function(_mockObj_, _getObj_, _$timeout_, _$interval_) {
                getObj = _getObj_;
                $timeout = _$timeout_;
                $interval = _$interval_;
                mockObj = _mockObj_;
                ref = mockObj.stubRef();
                obj = mockObj.makeObject(FIXTURE_DATA, ref);

            });
        });
        afterEach(function() {
            obj = null;
            ref = null;
        });
        describe('$ref', function() {
            it('should return the Firebase instance that created it', function() {
                expect(obj.$ref()).toBe(ref);
            });
        });
        describe('load', function() {
            beforeEach(function() {
                this.good = jasmine.createSpy('resolve');
                this.bad = jasmine.createSpy('reject');
            });
            it('should return a resolved promise', function() {
                var test = getObj.load(obj);
                // expect(test).toBeAPromise();
                expect(test.$$state.status).toEqual(1);
            });
            it('should resolve when all data is received', function() {
                var test = getObj.load(obj);
                test.then(this.good, this.bad);
                // works without the line below; not sure why
                // obj.$ref().flush();
                flushAll();
                expect(this.good).toHaveBeenCalledWith(obj);
                expect(this.bad).not.toHaveBeenCalled();
            });
            it("should reject if the promise is rejected", function() {
                var err = new Error("ERROR!!!");
                ref.failNext('once', err);
								var obj = mockObj.makeObject(null, ref);
                var test = getObj.load(obj);
                test.then(this.good, this.bad);
								flushAll();
								expect(this.good).not.toHaveBeenCalled();
								expect(this.bad).toHaveBeenCalledWith(err);
            });
						it("resolves to the firebaseObject instance", function(){
							var spy = jasmine.createSpy('loaded');
							getObj.load(obj).then(spy);
							flushAll();
							expect(spy).toHaveBeenCalledWith(obj);
						});
        });

        function flushAll() {
            Array.prototype.slice.call(arguments, 0).forEach(function(o) {
                angular.isFunction(o.resolve) ? o.resolve() : o.flush();
            });
            try {
                obj.$ref().flush();
            } catch (e) {}
            try {
                $interval.flush(500);
            } catch (e) {}
            try {
                $timeout.flush();
            } catch (e) {}
        }

    });
})();
