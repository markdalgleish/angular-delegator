'use strict';

describe('AllDelegatorStrategy', function() {

  var AllDelegatorStrategy;

  beforeEach(module('delegator'));

  beforeEach(inject(function(_AllDelegatorStrategy_) {
    AllDelegatorStrategy = _AllDelegatorStrategy_;
  }));

  it('should call all functions with supplied arguments', function() {
    var fns = [
        jasmine.createSpy('fn1'),
        jasmine.createSpy('fn2'),
        jasmine.createSpy('fn3')
      ],
      args = ['arg1','arg2'];
    AllDelegatorStrategy(fns, args);

    fns.forEach(function(fn) {
      expect(fn).toHaveBeenCalledWith(args[0], args[1]);
    });
  });

  it('should return true if all results are true', function() {
    var fns = [
        jasmine.createSpy('fn1').andReturn(true),
        jasmine.createSpy('fn2').andReturn(true),
        jasmine.createSpy('fn3').andReturn(true)
      ],
      result = AllDelegatorStrategy(fns, []);

    expect(result).toBe(true);
  });

  it('should return false if any results is false', function() {
    var fns = [
        jasmine.createSpy('fn1').andReturn(true),
        jasmine.createSpy('fn2').andReturn(false),
        jasmine.createSpy('fn3').andReturn(true)
      ],
      result = AllDelegatorStrategy(fns, []);

    expect(result).toBe(false);
  });

});
