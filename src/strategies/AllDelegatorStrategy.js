angular.module('delegator')
  .factory('AllDelegatorStrategy', ['MapDelegatorStrategy', function(MapDelegatorStrategy) {
    return function(fns, args) {
      return !MapDelegatorStrategy(fns, args).some(function(value){ return value === false; });
    };
  }]);
