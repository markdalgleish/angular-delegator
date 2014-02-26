[![Build Status](https://secure.travis-ci.org/markdalgleish/angular-delegator.png?branch=master)](https://travis-ci.org/markdalgleish/angular-delegator)

# angular-delegator

### Write smaller, cleaner AngularJS services.

With Angular Delegator, it's now easy to write smaller, cleaner, more maintainable services without a heap of tedious glue code.

Angular Delegator dynamically creates delegator services based on your configuration. Each delegator service talks to many smaller services that you write yourself, called delegates.

Each delegate service has the same interface as its delegator, allowing you to easily split complicated chunks of business logic into many small, simple steps.

> **Please note:** Angular Delegator is a very young project and the API is likely to change in the near future.

### Example

If you had a large validation service that checked an account's name, date, address and payment info, you could break it down like so:

```js
angular.module('myApp', ['delegator'])

  .config(function(DelegatorProvider) {

    DelegatorProvider.service('AccountValidationDelegator', {
      interface: {
        'isValid': 'all'
      },
      delegates: [
        'AccountNameValidationDelegate',
        'AccountDateValidationDelegate',
        'AccountAddressValidationDelegate',
        'AccountPaymentValidationDelegate'
      ]
    });

  });
```

The `interface` option defines which methods should be handled by the delegator, and which [delegator strategy](#delegator-strategies) to use. If none of the [built-in strategies](#delegator-strategies) are sufficient, you can easily write your own, easily testable [custom delegator strategies](#custom-delegator-strategies).

In this example, your application now has an `AccountValidationDelegator` service with a single method called `isValid`. You can now use this service just as you would with any regular service you wrote yourself, for example:

```js
angular.module('myApp').controller('SomeCtrl', function($scope, AccountValidationDelegator) {

  AccountValidationDelegator.isValid($scope.data);

});
```

## Delegator Strategies

<table>

    <tr>
      <th>map</th>
      <td>Returns an array of everything returned from the delegates</td>

    <tr>
      <th>merge</th>
      <td>Returns a single object, the result of merging all objects returned from the delegates</td>

    <tr>
      <th>truthy</th>
      <td>Returns an array of all truthy values returned from the delegates</td>

    <tr>
      <th>any</th>
      <td>Returns true if any delegate returns true</td>

    <tr>
      <th>all</th>
      <td>Returns true if all delegates return true</td>

    <tr>
      <th>none</th>
      <td>Returns true if no delegates return true</td>

</table>

### Custom Delegator Strategies

Strategies are implemented as services ending with 'DelegatorStrategy'. All built-in [delegator strategies](#delegator-strategies) are defined this way, and can be injected into your custom strategies.

For example,

```js
angular.module('myApp')

  .factory('FoobarDelegatorStrategy', function(AllDelegatorStrategy) {
    return function(fns, args) {
      // Here you have access to the delegate functions
      // and the arguments passed to the delegator.
      return AllDelegatorStrategy(fns, args);
    };
  })

  .config(function(DelegatorProvider) {
    DelegatorProvider.service('AccountValidationDelegator', {
      interface: {
        'isValid': 'foobar'
      },
      delegates: [
        'AccountNameValidationDelegate',
        'AccountDateValidationDelegate',
        'AccountAddressValidationDelegate',
        'AccountPaymentValidationDelegate'
      ]
    });

  });
```

## Installation

### Bower

```bash
$ bower install --save angular-delegator
```

### Download

Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/markdalgleish/angular-delegator/master/dist/angular-delegator.min.js
[max]: https://raw.github.com/markdalgleish/angular-delegator/master/dist/angular-delegator.js

## License

[MIT License](http://markdalgleish.mit-license.org)
