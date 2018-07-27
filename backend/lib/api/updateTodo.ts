import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import {save} from '../data/todo';

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
