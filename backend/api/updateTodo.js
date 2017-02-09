const todos = require('../data/todo');

exports.handler = (event, context, callback) => {
  'use strict';
  let todo = JSON.parse(event.body);
  
  if (todo.id !== event.pathParameters.id) {
    callback(null, {
      statusCode: '400'
    });
    return;
  }
  
  todos.save(todo).then(saved => {
    callback(null, {
      statusCode: '200',
      body: JSON.stringify(saved)
    });
  });
};