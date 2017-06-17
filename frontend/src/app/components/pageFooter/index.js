import angular from 'angular';

import template from './template.html';

let ComponentConfig = {
  template: template
};

const COMPONENT = 'pageFooter';
angular.module('app').component(COMPONENT, ComponentConfig);
export default COMPONENT;