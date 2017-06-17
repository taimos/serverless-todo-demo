import angular from 'angular';

class Service {
  
  constructor($http) {
    'ngInject';
    this.$http = $http;
  }
  
  getList() {
    return this.$http.get('/todos').then(function (res) {
      return res.data;
    });
  }
  
  create(todo) {
    return this.$http.post('/todos', todo).then(function (res) {
      return res.data;
    });
  }
  
  update(todo) {
    return this.$http.put('/todos/' + todo.id, todo).then(function (res) {
      return res.data;
    });
  }
  
}

const SERVICE = 'TodoService';
angular.module('app').service(SERVICE, Service);
export default SERVICE;