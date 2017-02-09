(function () {
  'use strict';
  
  angular
    .module('app')
    .config(routeConfig);
  
  function routeConfig($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/todos');
    
    $stateProvider
      .state('todos', {
        url: '/todos',
        params: {
          siteTitle: 'Todo list'
        },
        component: 'todoList',
        resolve: {
          todos: function (TodoService) {
            return TodoService.getList();
          }
        }
      })
    ;
  }
  
})();
