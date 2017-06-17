import angular from 'angular';

angular
  .module('app')
  .config(($provide, $httpProvider) => {
    'ngInject';
    // Intercept http calls.
    $provide.factory('ErrorHttpInterceptor', ($q, $log, $state, $timeout) => {
      'ngInject';
      return {
        // On request failure
        requestError: rejection => {
          $log.warn('HTTP Request Error:', rejection);
          // Return the promise rejection.
          return $q.reject(rejection);
        },
        
        // On response failure
        responseError: rejection => {
          $log.warn('HTTP Response Error:', rejection);
          if (rejection.status === 401) {
            $timeout(function () {
              $state.go('login');
            });
          }
          // Return the promise rejection.
          return $q.reject(rejection);
        }
      };
    });
    // Add the interceptor to the $httpProvider.
    $httpProvider.interceptors.push('ErrorHttpInterceptor');
  });

export default 'app-config';