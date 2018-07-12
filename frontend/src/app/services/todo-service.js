import angular from 'angular';

class Service {
  
  constructor($http) {
    'ngInject';
    this.$http = $http;
  }
  
  getList() {
    return this.$http.get('/todos').then(res => res.data);
  }
  
  create(todo) {
    return this.$http.post('/todos', todo).then(res => res.data);
  }
  
  update(todo) {
    return this.$http.put('/todos/' + todo.id, todo).then(res => res.data);
  }
  
}

const SERVICE = 'TodoService';
angular.module('app').service(SERVICE, Service);
export default SERVICE;