import angular from 'angular';

let directive = () => {
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
};

const DIRECTIVE = 'hrefVoid';
angular.module('app').directive(DIRECTIVE, directive);
export default DIRECTIVE;