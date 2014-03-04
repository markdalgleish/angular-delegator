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
