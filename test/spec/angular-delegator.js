'use strict';

describe('Module: $delegator', function () {

  var results, $delegator;

  describe('$delegator', function() {

    beforeEach(module('fixturesApp'));

    beforeEach(inject(function(_$delegator_) {
      $delegator = _$delegator_;
    }));

    describe('selectors', function() {

      it('should support services that return only functions', function() {
        expect($delegator.map('FunctionServices', 123)).toEqual([{ foo: 123 }, { bar: 123 }, { baz: 123 }]);
      });

      it('should support services that return objects', function() {
        expect($delegator.map('ObjectServices.echo', true)).toEqual([{ foo: true }, { bar: true }, { baz: true }]);
      });

      it('should support services that return nested objects', function() {
        expect($delegator.map('NestedObjectServices.foo.bar.baz.echo', true)).toEqual([{ foo: true }, { bar: true }, { baz: true }]);
      });

    });

    describe('arguments', function() {

      it('should support passing multiple arguments', function() {
        expect($delegator.map('MultipleArgServices', 1, 2, 3)).toEqual([{ foo: [1,2,3] }, { bar: [1,2,3] }, { baz: [1,2,3] }]);
      });

    });

    describe('map', function() {

      it('should return an array of results', function() {
        expect($delegator.map('FunctionServices', true)).toEqual([{ foo: true }, { bar: true }, { baz: true }]);
      });

    });

    describe('merge', function() {

      it('should merge the results into a single object', function() {
        expect($delegator.merge('FunctionServices', true)).toEqual({ foo: true, bar: true, baz: true });
      });

    });

    describe('any', function() {

      it('should return true if any result is true', function() {
        expect($delegator.any('BooleanServices', [false, true, false])).toEqual(true);
      });

      it('should return false if any no result is true', function() {
        expect($delegator.any('BooleanServices', [false, false, false])).toEqual(false);
      });

    });

    describe('all', function() {

      it('should return true if all result are true', function() {
        expect($delegator.all('BooleanServices', [true, true, true])).toEqual(true);
      });

      it('should return false if any any result is false', function() {
        expect($delegator.all('BooleanServices', [true, false, true])).toEqual(false);
      });

    });

    describe('none', function() {

      it('should return true if all result are false', function() {
        expect($delegator.none('BooleanServices', [false, false, false])).toEqual(true);
      });

      it('should return false if any any result is true', function() {
        expect($delegator.none('BooleanServices', [false, false, true])).toEqual(false);
      });

    });

    describe('truthy', function() {

      it('should return an array of truthy values', function() {
        expect($delegator.truthy('EchoServices', [1, false, 2, null, 3, undefined])).toEqual([1,2,3]);
      });

    });

  });

  describe('service', function() {

    var app, TestDelegator, returnValue;

    describe('function delegators', function() {

      beforeEach(function() {
        app = angular.module('serviceTestApp', ['delegator'])
          .config(function($delegatorProvider) {
            $delegatorProvider.service('TestDelegator', {
              type: 'fakemethod',
              delegates: [
                'Foo',
                'Bar',
                'Baz'
              ]
            });
          });

        module('serviceTestApp');

        returnValue = { foo: 'bar' };
        inject(function(_$delegator_, _TestDelegator_) {
          $delegator = _$delegator_;
          TestDelegator = _TestDelegator_;
          $delegator.fakemethod = jasmine.createSpy('fakemethod').andReturn(returnValue);
        });
      });

      it('should create a service that calls the delegator', function() {
        var expected = returnValue,
          result = TestDelegator(1,2,3,4);

        expect(result).toBe(expected);
        expect($delegator.fakemethod).toHaveBeenCalledWith('TestDelegator', 1, 2, 3, 4);
      });

    });

    describe('object delegators', function() {

      beforeEach(function() {
        app = angular.module('serviceTestApp', ['delegator'])
          .config(function($delegatorProvider) {
            $delegatorProvider.service('TestDelegator', {
              type: 'fakemethod',
              interface: [
                'foo',
                'bar'
              ],
              delegates: [
                'Foo',
                'Bar',
                'Baz'
              ]
            });
          });

        module('serviceTestApp');

        returnValue = { foo: 'bar' };
        inject(function(_$delegator_, _TestDelegator_) {
          $delegator = _$delegator_;
          TestDelegator = _TestDelegator_;
          $delegator.fakemethod = jasmine.createSpy('fakemethod').andReturn(returnValue);
        });
      });

      it('should create a service that calls nested methods on the delegator', function() {
        var expected = returnValue;

        var result = TestDelegator.foo(1,2);
        TestDelegator.bar(3,4);

        expect(result).toBe(expected);
        expect($delegator.fakemethod).toHaveBeenCalledWith('TestDelegator.foo', 1, 2);
        expect($delegator.fakemethod).toHaveBeenCalledWith('TestDelegator.bar', 3, 4);
      });

    });

  });

});
