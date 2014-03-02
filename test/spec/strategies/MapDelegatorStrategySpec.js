'use strict';

describe('MapDelegatorStrategy', function() {

  var MapDelegatorStrategy;

  beforeEach(module('delegator'));

  beforeEach(inject(function(_MapDelegatorStrategy_) {
    MapDelegatorStrategy = _MapDelegatorStrategy_;
  }));

  it('should call all functions with supplied arguments', function() {
    var fns = [
        jasmine.createSpy('fn1'),
        jasmine.createSpy('fn2'),
        jasmine.createSpy('fn3')
      ],
      args = ['arg1','arg2'];
    MapDelegatorStrategy(fns, args);

    fns.forEach(function(fn) {
      expect(fn).toHaveBeenCalledWith(args[0], args[1]);
    });
  });

  it('should return an array of results', function() {
    var fns = [
        jasmine.createSpy('fn1').andReturn('foo'),
        jasmine.createSpy('fn2').andReturn('bar'),
        jasmine.createSpy('fn3').andReturn('baz')
      ],
      result = MapDelegatorStrategy(fns, []);

    expect(result).toEqual(['foo', 'bar', 'baz']);
  });

});
