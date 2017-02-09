(function () {
  'use strict';
  
  angular.module('app').directive('pageTitle', function ($transitions, $timeout) {
    return {
      restrict: 'A',
      compile: function (element, attributes) {
        element.removeAttr('page-title data-page-title');
        
        var defaultTitle = attributes.pageTitle;
        
        $transitions.onStart({}, function (trans) {
          var newTitle = defaultTitle;
          if (trans.to() && trans.to().params.siteTitle) {
            newTitle = defaultTitle + ' | ' + trans.to().params.siteTitle;
          }
          // Set asynchronously so page changes before title does
          $timeout(function () {
            $('html head title').text(newTitle); // eslint-disable-line angular/angularelement
          });
        });
      }
    };
  });
  
})();
