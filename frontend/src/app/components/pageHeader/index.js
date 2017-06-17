import angular from 'angular';

import template from './template.html';

class Controller {
  
  constructor($transitions, $state) {
    'ngInject';
    let vm = this;
    $transitions.onSuccess({}, trans => {
      vm.updateTitle(trans.to());
    });
    this.updateTitle($state.current);
  }
  
  updateTitle(state) {
    if (state && state.params.siteTitle) {
      this.pageTitle = state.params.siteTitle;
    } else {
      this.pageTitle = '';
    }
    if (state && state.params.siteSubTitle) {
      this.secondaryTitle = state.params.siteSubTitle;
    } else {
      this.secondaryTitle = undefined;
    }
  }
}

let ComponentConfig = {
  template: template,
  controller: Controller
};

const COMPONENT = 'pageHeader';
angular.module('app').component(COMPONENT, ComponentConfig);
export default COMPONENT;

