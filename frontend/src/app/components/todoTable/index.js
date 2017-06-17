import angular from 'angular';

import template from './template.html';

class Controller {
  
  constructor(TodoService, $state) {
    'ngInject';
    this.todoService = TodoService;
    this.$state = $state;
  }
  
  proceed(todo) {
    if (!todo) {
      return;
    }
    this.updateTodo(todo, this.nextState(todo.state));
  }
  
  reopen(todo) {
    if (!todo) {
      return;
    }
    this.updateTodo(todo, 'OPEN');
  }
  
  updateTodo(todo, newState) {
    let toSave = angular.fromJson(angular.toJson(todo));
    toSave.state = newState;
    this.todoService.update(toSave).then(() => {
      this.$state.reload();
    })
  }
  
  nextState(state) {
    switch (state) {
      case 'OPEN':
        return 'IN_PROGRESS';
      case 'IN_PROGRESS':
        return 'DONE';
      default:
        return 'DONE';
    }
  }
}

let ComponentConfig = {
  bindings: {
    todos: '<',
    filter: '<'
  },
  template: template,
  controller: Controller
};

const COMPONENT = 'todoTable';
angular.module('app').component(COMPONENT, ComponentConfig);
export default COMPONENT;