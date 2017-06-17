import angular from 'angular';
import $ from 'jquery';

let directive = ($transitions, $timeout) => {
  'ngInject';
  return {
    restrict: 'A',
    compile: (element, attributes) => {
      element.removeAttr('page-title data-page-title');
      
      let defaultTitle = attributes.pageTitle;
      
      $transitions.onStart({}, function (trans) {
        let newTitle = defaultTitle;
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
};

const DIRECTIVE = 'pageTitle';
angular.module('app').directive(DIRECTIVE, directive);
export default DIRECTIVE;