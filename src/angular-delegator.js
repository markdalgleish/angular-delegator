(function() {
  'use strict';

  var module = angular.module('delegator', []);

  module
    .provider('Delegator', ['$provide', function($provide) {
      var collections = {};

      this.$get = ['$injector', function($injector) {

        var map = function(arr, fn) {
            return arr.map(fn);
          },

          getArgs = function(args) {
            return [].slice.call(args, 1);
          },

          getFunctions = function(selector) {
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
          },

          extend = function(acc, obj) {
            for (var key in obj) {
              if (obj.hasOwnProperty(key)) {
                acc[key] = obj[key];
              }
            }
            return acc;
          },

          mapSelector = function(fns, args) {
            return map(fns, function(fn) {
              return fn.apply(null, args);
            });
          },

          mergeSelector = function() {
            return mapSelector.apply(null, arguments).reduce(extend, {});
          },

          truthySelector = function() {
            return mapSelector.apply(null, arguments).filter(function(result) { return result; });
          },

          someSelector = function(fns, args, value) {
            return mapSelector.call(null, fns, args).some(function(result) { return result === value; });
          },

          anySelector = function(fns, args) {
            return someSelector(fns, args, true);
          },

          allSelector = function(fns, args) {
            return !someSelector(fns, args, false);
          },

          noneSelector = function(fns, args) {
            return !someSelector(fns, args, true);
          };

        var strategies = {
          map: mapSelector,
          merge: mergeSelector,
          truthy: truthySelector,
          any: anySelector,
          all: allSelector,
          none: noneSelector
        };

        return {
          run: function(selector, strategy) {
            var args = [].slice.call(arguments, 2);
            return (strategies[strategy] || $injector.get(strategyServiceNameFrom(strategy))).call(null, getFunctions(selector), args);
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
}());
