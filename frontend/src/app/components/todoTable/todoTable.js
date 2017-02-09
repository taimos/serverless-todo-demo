(function () {
  'use strict';
  
  angular
    .module('app')
    .component('todoTable', {
      bindings: {
        todos: '<',
        filter: '<'
      },
      templateUrl: 'app/components/todoTable/todoTable.html',
      controller: Controller
    });
  
  /** @ngInject */
  function Controller(TodoService, $state) {
    var vm = this;
    vm.proceed = function (todo) {
      if (!todo) {
        return;
      }
      updateTodo(todo, nextState(todo.state));
    };
    vm.reopen = function (todo) {
      if (!todo) {
        return;
      }
      updateTodo(todo, 'OPEN');
    };
    
    function updateTodo(todo, newState) {
      var toSave = angular.fromJson(angular.toJson(todo));
      toSave.state = newState;
      TodoService.update(toSave).then(function () {
        $state.reload();
      })
    }
  }
  
  function nextState(state) {
    switch (state) {
      case 'OPEN':
        return 'IN_PROGRESS';
      case 'IN_PROGRESS':
        return 'DONE';
      default:
        return 'DONE';
    }
  }
  
})();