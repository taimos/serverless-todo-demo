import {save} from '../data/todo';

export default async (event, context, callback) => {
  let todo = JSON.parse(event.body);
  
  if (todo.id !== event.pathParameters.id) {
    callback(null, {
      statusCode: '400'
    });
    return;
  }
  
  callback(null, {
    statusCode: '200',
    body: JSON.stringify(await save(todo))
  });
};