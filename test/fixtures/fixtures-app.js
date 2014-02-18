(function() {
  'use strict';

  var app = angular.module('fixturesApp', ['delegator']);

  app.config(function(DelegatorProvider) {

    var serviceNamesFor = function(type) {
      return ['Foo','Bar','Baz'].map(function(name) { return type + name; });
    };

    ['Function', 'Object', 'NestedObject', 'MultipleArg', 'Boolean'].forEach(function(type) {
      DelegatorProvider.set(type + 'Services', serviceNamesFor(type));
    });

    DelegatorProvider.set('EchoServices', [
      'EchoA',
      'EchoB',
      'EchoC',
      'EchoD',
      'EchoE'
    ]);

    // Services

    DelegatorProvider
      .service('GeneratedMapDelegator', {
        type: 'map',
        delegates: serviceNamesFor('Function')
      })

      .service('GeneratedMergeDelegator', {
        type: 'merge',
        delegates: serviceNamesFor('Function')
      })

      .service('GeneratedAnyDelegator', {
        type: 'any',
        delegates: serviceNamesFor('Boolean')
      });

  });

  ['Foo', 'Bar', 'Baz'].forEach(function(serviceName, i) {

    app.factory('Function' + serviceName, function() {
      return function(arg){
        var obj = {};
        obj[serviceName.toLowerCase()] = arg;
        return obj;
      };
    });

    app.factory('Object' + serviceName, function() {
      return {
        echo: function(arg){
          var obj = {};
          obj[serviceName.toLowerCase()] = arg;
          return obj;
        }
      };
    });

    app.factory('NestedObject' + serviceName, function() {
      return {
        foo: {
          bar: {
            baz: {
              echo: function(arg){
                var obj = {};
                obj[serviceName.toLowerCase()] = arg;
                return obj;
              }
            }
          }
        }
      };
    });

    app.factory('MultipleArg' + serviceName, function() {
      return function(arg1, arg2, arg3){
        var obj = {};
        obj[serviceName.toLowerCase()] = [arg1, arg2, arg3];
        return obj;
      };
    });

    app.factory('Boolean' + serviceName, function() {
      return function(values){
        return values[i];
      };
    });

  });

  ['A', 'B', 'C', 'D', 'E'].forEach(function(serviceName, i) {
    app.factory('Echo' + serviceName, function() {
      return function(values){
        return values[i];
      };
    });
  });

}());
