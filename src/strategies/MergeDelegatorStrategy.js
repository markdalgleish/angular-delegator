angular.module('delegator')
  .factory('MergeDelegatorStrategy', ['MapDelegatorStrategy', function(MapDelegatorStrategy) {
    var extend = function(acc, obj) {
      for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
          acc[key] = obj[key];
        }
      }
      return acc;
    };

    return function() {
      return MapDelegatorStrategy.apply(null, arguments).reduce(extend, {});
    };
  }]);
