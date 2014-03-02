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

      var getFunctions = function(selector) {
          var parts = selector.split('.'),
            name = parts[0],
            serviceInstances = collections[name].map($injector.get),
            propertyNames = parts.slice(1),
            fns = serviceInstances;

          propertyNames.forEach(function(propertyName) {
            fns = fns.map(function(fn) {
              return fn[propertyName];
            });
          });

          return fns;
        },

        strategyServiceNameFrom = function(strategyShortName) {
          return strategyShortName[0].toUpperCase() +
            strategyShortName.slice(1) +
            'DelegatorStrategy';
        };

      var strategies = {};

      return {
        run: function(selector, strategyShortName) {
          var args = [].slice.call(arguments, 2);
          return $injector.get(strategyServiceNameFrom(strategyShortName)).call(null, getFunctions(selector), args);
        }
      };
    }];

    this.set = function(name, services) {
      collections[name] = services;
      return this;
    };

    this.service = function(name, options) {
      this.set(name, options.delegates);

      $provide.service(name, ['Delegator', function(Delegator) {
        var makeDelegatorFunction = function(method, strategy) {
          var selector = name + (method ? '.' + method : '');
          return function() {
            return Delegator.run.apply(null, [selector, strategy || options.interface].concat([].slice.call(arguments)));
          };
        };

        return typeof options.interface === 'object' ?
          Object.keys(options.interface).reduce(function(delegator, method) {
            delegator[method] = makeDelegatorFunction(method, options.interface[method]);
            return delegator;
          }, {}) :
          makeDelegatorFunction();
      }]);

      return this;
    };
  }]);

angular.module('delegator')
  .factory('AllDelegatorStrategy', function(MapDelegatorStrategy) {
    return function(fns, args) {
      return !MapDelegatorStrategy(fns, args).some(function(value){ return value === false; });
    };
  });

angular.module('delegator')
  .factory('AnyDelegatorStrategy', function(MapDelegatorStrategy) {
    return function(fns, args) {
      return MapDelegatorStrategy(fns, args).some(function(value){ return value === true; });
    };
  });

angular.module('delegator')
  .factory('MapDelegatorStrategy', function() {
    return function(fns, args) {
      return fns.map(function(fn) {
        return fn.apply(null, args);
      });
    };
  });

angular.module('delegator')
  .factory('MergeDelegatorStrategy', function(MapDelegatorStrategy) {
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
  });

angular.module('delegator')
  .factory('NoneDelegatorStrategy', function(MapDelegatorStrategy) {
    return function(fns, args) {
      return !MapDelegatorStrategy(fns, args).some(function(value){ return value === true; });
    };
  });

angular.module('delegator')
  .factory('TruthyDelegatorStrategy', function(MapDelegatorStrategy) {
    return function() {
      return MapDelegatorStrategy.apply(null, arguments).filter(function(result) { return result; });
    };
  });

}());