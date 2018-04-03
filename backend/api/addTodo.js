import {save} from '../data/todo';
import uuid from 'node-uuid';

export default async (event) => {
  let todo = JSON.parse(event.body);
  todo.id = uuid.v4();
  
  let saved = await save(todo);
  
  return {
    statusCode: '201',
    headers: {
      Location: '/todos/' + saved.id
    },
    body: JSON.stringify(saved)
  };
};