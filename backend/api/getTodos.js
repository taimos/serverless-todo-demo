const todos = require('../data/todo');

exports.handler = (event, context, callback) => {
  'use strict';
  
  todos.listTodos().then(list => {
    callback(null, {
      statusCode: '200',
      body: JSON.stringify(list)
    });
  });
};