import angular from 'angular';

import template from './template.html';
import '../addTodo';
import '../todoTable';

class Controller {
  
  constructor() {
    'ngInject';
    
  }
}

let ComponentConfig = {
  bindings: {
    todos: '<'
  },
  template: template,
  controller: Controller
};

const COMPONENT = 'todoList';
angular.module('app').component(COMPONENT, ComponentConfig);
export default COMPONENT;