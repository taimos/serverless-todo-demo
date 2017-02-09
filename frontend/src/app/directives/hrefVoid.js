(function () {
  'use strict';
  
  angular.module('app').directive('hrefVoid', function () {
    return {
      restrict: 'A',
      link: function (scope, element) {
        element.attr('href', '#');
        element.on('click', function (e) {
          e.preventDefault();
          e.stopPropagation();
        });
      }
    };
  });
})();