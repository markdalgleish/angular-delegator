angular.module('delegator')
  .factory('NoneDelegatorStrategy', function(MapDelegatorStrategy) {
    return function(fns, args) {
      return !MapDelegatorStrategy(fns, args).some(function(value){ return value === true; });
    };
  });
