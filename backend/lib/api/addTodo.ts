import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import * as uuid from 'node-uuid';
import {save, ToDo} from '../data/todo';

export const apiAddTodo = async (event : APIGatewayProxyEvent) : Promise<APIGatewayProxyResult> => {
    const todo : ToDo = JSON.parse(event.body);
    todo.id = uuid.v4();

    const saved : ToDo = await save(todo);

    return {
        statusCode: 201,
        headers: {
            Location: '/todos/' + saved.id,
        },
        body: JSON.stringify(saved),
    };
};
