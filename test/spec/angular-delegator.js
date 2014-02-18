'use strict';

describe('Module: Delegator', function () {

  var results, Delegator;

  describe('Delegator', function() {

    beforeEach(module('fixturesApp'));

    beforeEach(inject(function(_Delegator_) {
      Delegator = _Delegator_;
    }));

    describe('selectors', function() {

      it('should support services that return only functions', function() {
        expect(Delegator.run('FunctionServices', 'map', 123)).toEqual([{ foo: 123 }, { bar: 123 }, { baz: 123 }]);
      });

      it('should support services that return objects', function() {
        expect(Delegator.run('ObjectServices.echo', 'map', true)).toEqual([{ foo: true }, { bar: true }, { baz: true }]);
      });

      it('should support services that return nested objects', function() {
        expect(Delegator.run('NestedObjectServices.foo.bar.baz.echo', 'map', true)).toEqual([{ foo: true }, { bar: true }, { baz: true }]);
      });

    });

    describe('arguments', function() {

      it('should support passing multiple arguments', function() {
        expect(Delegator.run('MultipleArgServices', 'map', 1, 2, 3)).toEqual([{ foo: [1,2,3] }, { bar: [1,2,3] }, { baz: [1,2,3] }]);
      });

    });

    describe('map', function() {

      it('should return an array of results', function() {
        expect(Delegator.run('FunctionServices', 'map', true)).toEqual([{ foo: true }, { bar: true }, { baz: true }]);
      });

    });

    describe('merge', function() {

      it('should merge the results into a single object', function() {
        expect(Delegator.run('FunctionServices', 'merge', true)).toEqual({ foo: true, bar: true, baz: true });
      });

    });

    describe('any', function() {

      it('should return true if any result is true', function() {
        expect(Delegator.run('BooleanServices', 'any', [false, true, false])).toEqual(true);
      });

      it('should return false if any no result is true', function() {
        expect(Delegator.run('BooleanServices', 'any', [false, false, false])).toEqual(false);
      });

    });

    describe('all', function() {

      it('should return true if all result are true', function() {
        expect(Delegator.run('BooleanServices', 'all', [true, true, true])).toEqual(true);
      });

      it('should return false if any any result is false', function() {
        expect(Delegator.run('BooleanServices', 'all', [true, false, true])).toEqual(false);
      });

    });

    describe('none', function() {

      it('should return true if all result are false', function() {
        expect(Delegator.run('BooleanServices', 'none', [false, false, false])).toEqual(true);
      });

      it('should return false if any any result is true', function() {
        expect(Delegator.run('BooleanServices', 'none', [false, false, true])).toEqual(false);
      });

    });

    describe('truthy', function() {

      it('should return an array of truthy values', function() {
        expect(Delegator.run('EchoServices', 'truthy', [1, false, 2, null, 3, undefined])).toEqual([1,2,3]);
      });

    });

  });

  describe('service', function() {

    var app, TestDelegator, returnValue, strategySpy, Foo, Bar, Baz;

    beforeEach(function() {
      returnValue = { foo: 'bar' };
      strategySpy = jasmine.createSpy('strategySpy').andReturn(returnValue);
      Foo = { qux: jasmine.createSpy('FooQux') };
      Bar = { qux: jasmine.createSpy('BarQux') };
      Baz = { qux: jasmine.createSpy('BazQux') };
    });

    describe('custom function strategies', function() {

      beforeEach(function() {
        app = angular.module('serviceTestApp', ['delegator'])
          .factory('Foo', function() {
            return Foo;
          })
          .factory('Bar', function() {
            return Bar;
          })
          .factory('Baz', function() {
            return Baz;
          })
          .factory('FooBarDelegatorStrategy', function() {
            return strategySpy;
          })
          .config(function(DelegatorProvider) {
            DelegatorProvider.service('TestDelegator', {
              type: 'fooBar',
              delegates: [
                'Foo',
                'Bar',
                'Baz'
              ]
            });
          });

        module('serviceTestApp');

        inject(function(_Delegator_, _TestDelegator_) {
          Delegator = _Delegator_;
          TestDelegator = _TestDelegator_;
        });
      });

      it('should allow the use of custom strategies', function() {
        var expected = returnValue,
          result = TestDelegator(1,2,3,4);

        expect(result).toBe(expected);
        expect(strategySpy).toHaveBeenCalledWith([Foo, Bar, Baz], [1, 2, 3, 4]);
      });

    });

    describe('custom object strategies', function() {

      beforeEach(function() {
        app = angular.module('serviceTestApp', ['delegator'])
          .factory('Foo', function() {
            return Foo;
          })
          .factory('Bar', function() {
            return Bar;
          })
          .factory('Baz', function() {
            return Baz;
          })
          .factory('FooBarDelegatorStrategy', function() {
            return strategySpy;
          })
          .config(function(DelegatorProvider) {
            DelegatorProvider.service('TestDelegator', {
              interface: [
                'qux'
              ],
              type: 'fooBar',
              delegates: [
                'Foo',
                'Bar',
                'Baz'
              ]
            });
          });

        module('serviceTestApp');

        inject(function(_Delegator_, _TestDelegator_) {
          Delegator = _Delegator_;
          TestDelegator = _TestDelegator_;
        });
      });

      it('should allow the use of custom strategies', function() {
        var expected = returnValue,
          result = TestDelegator.qux(1,2,3,4);

        expect(result).toBe(expected);
        expect(strategySpy).toHaveBeenCalledWith([Foo.qux, Bar.qux, Baz.qux], [1, 2, 3, 4]);
      });

    });

  });

});
