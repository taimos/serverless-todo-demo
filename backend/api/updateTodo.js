import {save} from '../data/todo';

export default async (event) => {
  let todo = JSON.parse(event.body);
  
  if (todo.id !== event.pathParameters.id) {
    return {
      statusCode: '400'
    };
  }
  
  return {
    statusCode: '200',
    body: JSON.stringify(await save(todo))
  };
};