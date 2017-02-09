const todos = require('../data/todo');
const uuid = require('node-uuid');

exports.handler = (event, context, callback) => {
  'use strict';
  
  let todo = JSON.parse(event.body);
  todo.id = uuid.v4();
  
  todos.save(todo).then(saved => {
    callback(null, {
      statusCode: '201',
      headers: {
        Location: '/todos/' + saved.id
      },
      body: JSON.stringify(saved)
    });
  });
  
};