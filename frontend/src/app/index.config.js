(function () {
  'use strict';
  
  angular
    .module('app')
    .config(function ($provide, $httpProvider) {
      // Intercept http calls.
      $provide.factory('ErrorHttpInterceptor', function ($q, $log) {
        return {
          // On request failure
          requestError: function (rejection) {
            $log.warn(rejection);
            // Return the promise rejection.
            return $q.reject(rejection);
          },
          
          // On response failure
          responseError: function (rejection) {
            $log.warn(rejection);
            // Return the promise rejection.
            return $q.reject(rejection);
          }
        };
      });
      
      // Add the interceptor to the $httpProvider.
      $httpProvider.interceptors.push('ErrorHttpInterceptor');
    });
  
  
})();
