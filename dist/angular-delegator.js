/*!
 * angular-delegator v0.0.7
 * https://github.com/markdalgleish/angular-delegator
 *
 * Copyright 2014, Mark Dalgleish
 * This content is released under the MIT license
 */

(function(){

angular.module('delegator', [])
  .provider('Delegator', ['$provide', function($provide) {
    var collections = {};

    this.$get = ['$injector', function($injector) {

      var strategyServiceNameFrom = function(strategyShortName) {
          return strategyShortName[0].toUpperCase() +
            strategyShortName.slice(1) +
            'DelegatorStrategy';
        };

      return {
        create: function(options) {
          var createDelegator = function() {
              return Object.keys(options.interface).reduce(function(delegator, methodName) {
                delegator[methodName] = createDelegatorMethod(methodName, options.interface[methodName]);
                return delegator;
              }, {});
            },

            createDelegatorMethod = function(methodName, strategyShortName) {
              var strategy = $injector.get(strategyServiceNameFrom(strategyShortName));
              return function() {
                return strategy(getMethods(methodName), arguments);
              };
            },

            getMethods = function(methodName) {
              var services = options.delegates.map($injector.get),
                methods = services.map(function(service) {
                  return service[methodName];
                });

              return methods;
            };

          return createDelegator();
        }
      };
    }];

    this.service = function(name, options) {
      $provide.service(name, ['Delegator', function(Delegator) {
        return Delegator.create(options);
      }]);

      return this;
    };
  }]);

angular.module('delegator')
  .factory('AllDelegatorStrategy', ['MapDelegatorStrategy', function(MapDelegatorStrategy) {
    return function(fns, args) {
      return !MapDelegatorStrategy(fns, args).some(function(value){ return value === false; });
    };
  }]);

angular.module('delegator')
  .factory('AnyDelegatorStrategy', ['MapDelegatorStrategy', function(MapDelegatorStrategy) {
    return function(fns, args) {
      return MapDelegatorStrategy(fns, args).some(function(value){ return value === true; });
    };
  }]);

angular.module('delegator')
  .factory('MapDelegatorStrategy', function() {
    return function(fns, args) {
      return fns.map(function(fn) {
        return fn.apply(null, args);
      });
    };
  });

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

angular.module('delegator')
  .factory('NoneDelegatorStrategy', ['MapDelegatorStrategy', function(MapDelegatorStrategy) {
    return function(fns, args) {
      return !MapDelegatorStrategy(fns, args).some(function(value){ return value === true; });
    };
  }]);

angular.module('delegator')
  .factory('TruthyDelegatorStrategy', ['MapDelegatorStrategy', function(MapDelegatorStrategy) {
    return function() {
      return MapDelegatorStrategy.apply(null, arguments).filter(function(result) { return result; });
    };
  }]);

}());