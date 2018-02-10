import {save} from '../data/todo';
import uuid from 'node-uuid';

export default async (event, context, callback) => {
  let todo = JSON.parse(event.body);
  todo.id = uuid.v4();
  
  let saved = await save(todo);
  
  callback(null, {
    statusCode: '201',
    headers: {
      Location: '/todos/' + saved.id
    },
    body: JSON.stringify(saved)
  });
  
};