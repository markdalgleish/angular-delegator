angular.module('delegator')
  .factory('MapDelegatorStrategy', function() {
    return function(fns, args) {
      return fns.map(function(fn) {
        return fn.apply(null, args);
      });
    };
  });
