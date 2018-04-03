import {listTodos} from '../data/todo';

export default async () => {
  return {
    statusCode: '200',
    body: JSON.stringify(await listTodos())
  };
};