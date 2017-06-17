import angular from 'angular';

import todoList from './components/todoList';

let routeConfig = ($stateProvider, $urlRouterProvider) => {
    'ngInject';
    $urlRouterProvider.otherwise('/todos');
    
    $stateProvider
      .state('todos', {
        url: '/todos',
        params: {
          siteTitle: 'Todo list'
        },
        component: todoList,
        resolve: {
          todos: function (TodoService) {
            return TodoService.getList();
          }
        }
      })
    ;
  }
;

angular.module('app').config(routeConfig);
