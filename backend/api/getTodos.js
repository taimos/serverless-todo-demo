import {listTodos} from '../data/todo';

export default async (event, context, callback) => {
  callback(null, {
    statusCode: '200',
    body: JSON.stringify(await listTodos())
  });
};