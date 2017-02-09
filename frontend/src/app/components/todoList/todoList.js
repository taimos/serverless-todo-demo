(function () {
  'use strict';
  
  angular
    .module('app')
    .component('todoList', {
      bindings: {
        todos: '<'
      },
      templateUrl: 'app/components/todoList/todoList.html',
      controller: Controller
    });
  
  /** @ngInject */
  function Controller() {
    // var vm = this;
  }
  
})();