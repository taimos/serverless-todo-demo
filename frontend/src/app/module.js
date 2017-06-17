import angular from 'angular';

import '../style/app.scss';

import modal from 'angular-ui-bootstrap/src/modal';
import tooltip from 'angular-ui-bootstrap/src/tooltip';
import router from 'angular-ui-router';
import messages from 'angular-messages';

angular.module('app', [router, modal, tooltip, messages]);

export default 'app-module';