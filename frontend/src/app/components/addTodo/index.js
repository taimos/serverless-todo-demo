import angular from 'angular';

import template from './template.html';

class Controller {
  
  constructor(TodoService, $state) {
    'ngInject';
    this.todoService = TodoService;
    this.$state = $state;
  }
  
  create() {
    let todo = {
      text: this.text,
      state: 'OPEN'
    };
    this.todoService.create(todo).then(() => {
      this.$state.reload();
    })
  }
}

let ComponentConfig = {
  bindings: {},
  template: template,
  controller: Controller
};

const COMPONENT = 'addTodo';
angular.module('app').component(COMPONENT, ComponentConfig);
export default COMPONENT;