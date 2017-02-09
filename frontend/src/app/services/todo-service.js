(function () {
  'use strict';
  angular.module('app')
    .factory('TodoService', Service);
  
  /** @ngInject */
  function Service($http) {
    return {
      getList: function () {
        return $http.get('/todos').then(function (res) {
          return res.data;
        });
      },
      create: function (todo) {
        return $http.post('/todos', todo).then(function (res) {
          return res.data;
        });
      },
      update: function (todo) {
        return $http.put('/todos/' + todo.id, todo).then(function (res) {
          return res.data;
        });
      }
    };
  }
  
})();