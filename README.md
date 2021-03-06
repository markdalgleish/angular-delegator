[![Build Status](https://img.shields.io/travis/markdalgleish/angular-delegator/master.svg?style=flat)](https://travis-ci.org/markdalgleish/angular-delegator) [![Coverage Status](https://img.shields.io/coveralls/markdalgleish/angular-delegator/master.svg?style=flat)](https://coveralls.io/r/markdalgleish/angular-delegator) [![Code Climate](https://img.shields.io/codeclimate/github/markdalgleish/angular-delegator.svg?style=flat)](https://codeclimate.com/github/markdalgleish/angular-delegator)

# angular-delegator

### Write smaller, cleaner AngularJS services.

Break large services into smaller services with the same interface. Angular-delegator will wire them up for you based on your configuration.

> **Please note:** Angular Delegator is a very young project. The API is likely to change in the near future.

### Example

If you had a large validation service that checked an account's name, date, address and payment info, you could break it down like so:

```js
angular.module('myApp', ['delegator'])

  .factory('AccountValidator', function(Delegator) {

    return Delegator.create({
      interface: {
        'isValid': 'all'
      },
      delegates: [
        'AccountNameValidator',
        'AccountDateValidator',
        'AccountAddressValidator',
        'AccountPaymentValidator'
      ]
    });

  });
```

The `interface` option defines which methods should be handled by the delegator, and which [delegator strategy](#delegator-strategies) to use. If none of the [built-in strategies](#delegator-strategies) are sufficient, you can easily write your own, easily testable [custom delegator strategies](#custom-delegator-strategies).

In this example, your application now has an `AccountValidator` service with a single method called `isValid`:

```js
angular.module('myApp').controller('SomeCtrl', function($scope, AccountValidator) {

  AccountValidator.isValid($scope.data);

});
```

## Automatically Generated Delegator Services

Rather than manually creating a delegator service, it can be generated for you dynamically in your module's config step:

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
