import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as uuid from 'node-uuid';
import { listTodos, save, ToDo } from './data';

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

export const apiGetTodos = async () : Promise<APIGatewayProxyResult> => {
    return ({
        statusCode: 200,
        body: JSON.stringify(await listTodos()),
    });
};

export const apiUpdateTodo = async (event : APIGatewayProxyEvent) : Promise<APIGatewayProxyResult> => {
    const todo = JSON.parse(event.body);

    if (todo.id !== event.pathParameters.id) {
        return {
            statusCode: 400,
            body: '',
        };
    }

    return {
        statusCode: 200,
        body: JSON.stringify(await save(todo)),
    };
};
