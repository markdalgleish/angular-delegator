'use strict';

describe('AnyDelegatorStrategy', function() {

  var AnyDelegatorStrategy;

  beforeEach(module('delegator'));

  beforeEach(inject(function(_AnyDelegatorStrategy_) {
    AnyDelegatorStrategy = _AnyDelegatorStrategy_;
  }));

  it('should call all functions with supplied arguments', function() {
    var fns = [
        jasmine.createSpy('fn1'),
        jasmine.createSpy('fn2'),
        jasmine.createSpy('fn3')
      ],
      args = ['arg1','arg2'];
    AnyDelegatorStrategy(fns, args);

    fns.forEach(function(fn) {
      expect(fn).toHaveBeenCalledWith(args[0], args[1]);
    });
  });

  it('should return true if any result is true', function() {
    var fns = [
        jasmine.createSpy('fn1').andReturn(false),
        jasmine.createSpy('fn2').andReturn(true),
        jasmine.createSpy('fn3').andReturn(false)
      ],
      result = AnyDelegatorStrategy(fns, []);

    expect(result).toBe(true);
  });

  it('should return false if all results are false', function() {
    var fns = [
        jasmine.createSpy('fn1').andReturn(false),
        jasmine.createSpy('fn2').andReturn(false),
        jasmine.createSpy('fn3').andReturn(false)
      ],
      result = AnyDelegatorStrategy(fns, []);

    expect(result).toBe(false);
  });

});
