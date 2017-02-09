require('strict-mode')(function () {
  'use strict';
  
  exports.apiGetTodos = require('./api/getTodos').handler;
  exports.apiAddTodo = require('./api/addTodo').handler;
  exports.apiUpdateTodo = require('./api/updateTodo').handler;
  
});
