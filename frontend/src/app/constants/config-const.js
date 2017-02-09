(function () {
  "use strict";

  angular.module('app')
    .constant('APP_CONFIG', {
      // gulp environment: injects environment vars
      ENV: {
        /*inject-env*/
        'Env': 'Prod'
        /*endinject*/
      }
    });

})();
