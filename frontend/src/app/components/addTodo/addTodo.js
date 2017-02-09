(function () {
  'use strict';
  
  angular
    .module('app')
    .component('addTodo', {
      templateUrl: 'app/components/addTodo/addTodo.html',
      controller: Controller
    });
  
  /** @ngInject */
  function Controller(TodoService, $state) {
    var vm = this;
    vm.create = function () {
      var todo = {
        text: vm.text,
        state: 'OPEN'
      };
      TodoService.create(todo).then(function () {
        $state.reload();
      })
    }
  }
  
})();