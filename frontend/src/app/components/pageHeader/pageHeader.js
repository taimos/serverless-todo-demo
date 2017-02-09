(function () {
  'use strict';
  
  angular
    .module('app')
    .component('pageHeader', {
      templateUrl: 'app/components/pageHeader/pageHeader.html',
      controller: Controller
    });
  
  /** @ngInject */
  function Controller($transitions, $state) {
    var vm = this;
    $transitions.onSuccess({}, function (trans) {
      updateTitle(trans.to());
    });
    updateTitle($state.current);
  
    function updateTitle(state) {
      if (state && state.params.siteTitle) {
        vm.pageTitle = state.params.siteTitle;
      } else {
        vm.pageTitle = '';
      }
      if (state && state.params.siteSubTitle) {
        vm.secondaryTitle = state.params.siteSubTitle;
      } else {
        vm.secondaryTitle = undefined;
      }
    }
  }
  
})();