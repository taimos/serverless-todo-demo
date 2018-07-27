import {APIGatewayProxyResult} from 'aws-lambda';
import {listTodos} from '../data/todo';

export const apiGetTodos = async () : Promise<APIGatewayProxyResult> => {
    return ({
        statusCode: 200,
        body: JSON.stringify(await listTodos()),
    });
};
