import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { expect } from 'chai';
import * as lambdaLocal from 'lambda-local';
import { describe, it } from 'mocha';
import * as proxyquire from 'proxyquire';
import { ToDo } from '../lib/data';

lambdaLocal.getLogger().level = 'error';

const todoStub = {
    listTodos: undefined,
    save: undefined,
};
const uuidStub = {
    v4: undefined,
};

const api = proxyquire('../lib/index', { './data': todoStub, 'node-uuid': uuidStub });

describe('GetAPI', () => {
    beforeEach(() => {
        delete todoStub.listTodos;
    });

    it('should return list of todos', async () => {
        todoStub.listTodos = () => {
            return Promise.resolve([{
                id: 'SomeId',
                text: 'Todo text',
                state: 'OPEN',
            }]);
        };

        const response : APIGatewayProxyResult = await lambdaLocal.execute({
            event: {},
            lambdaFunc: api,
            lambdaHandler: 'apiGetTodos',
        });

        expect(response).to.have.property('statusCode', 200);
        expect(response).to.have.property('body');
        const list = JSON.parse(response.body);
        expect(list).to.be.an('array').that.has.lengthOf(1);
        expect(list[0]).to.have.property('id', 'SomeId');
        expect(list[0]).to.have.property('text', 'Todo text');
        expect(list[0]).to.have.property('state', 'OPEN');
    });
});

describe('AddAPI', () => {
    beforeEach(() => {
        delete todoStub.save;
    });

    it('should save new todo', async () => {
        uuidStub.v4 = () => 'randomID';
        todoStub.save = (todoToSave : ToDo) => {
            expect(todoToSave).to.have.property('id', 'randomID');
            expect(todoToSave).to.have.property('text', 'SomeText');
            expect(todoToSave).to.have.property('state', 'OPEN');
            return Promise.resolve(todoToSave);
        };

        const event = {
            body: JSON.stringify({
                text: 'SomeText',
                state: 'OPEN',
            }),
        };

        const response : APIGatewayProxyResult = await lambdaLocal.execute({
            event,
            lambdaFunc: api,
            lambdaHandler: 'apiAddTodo',
        });

        expect(response).to.have.property('statusCode', 201);
        expect(response).to.have.property('headers');
        expect(response.headers).to.have.property('Location', '/todos/randomID');
        expect(response).to.have.property('body');
        const todo : ToDo = JSON.parse(response.body);
        expect(todo).to.have.property('id', 'randomID');
        expect(todo).to.have.property('text', 'SomeText');
        expect(todo).to.have.property('state', 'OPEN');
    });

});

describe('UpdateAPI', () => {
    beforeEach(() => {
        delete todoStub.save;
    });

    it('should update todo', async () => {
        todoStub.save = (todoToSave : ToDo) => {
            expect(todoToSave).to.have.property('id', 'someId');
            expect(todoToSave).to.have.property('text', 'SomeText');
            expect(todoToSave).to.have.property('state', 'OPEN');
            return Promise.resolve(todoToSave);
        };

        const event : APIGatewayProxyEvent = {
            httpMethod: 'PUT',
            pathParameters: {
                id: 'someId',
            },
            queryStringParameters: {},
            multiValueHeaders: {},
            multiValueQueryStringParameters: {},
            stageVariables: {},
            requestContext: undefined,
            resource: '',
            headers: {},
            body: JSON.stringify({
                id: 'someId',
                text: 'SomeText',
                state: 'OPEN',
            }),
            path: '/todos/{id}',
            isBase64Encoded: false,
        };

        const response : APIGatewayProxyResult = await lambdaLocal.execute({
            event,
            lambdaFunc: api,
            lambdaHandler: 'apiUpdateTodo',
        });

        expect(response.statusCode).to.equal(200);
        expect(response).to.haveOwnProperty('body');
        const todo = JSON.parse(response.body);
        expect(todo).to.have.property('id', 'someId');
        expect(todo).to.have.property('text', 'SomeText');
        expect(todo).to.have.property('state', 'OPEN');
    });

    it('should fail for invalid id', async () => {
        todoStub.save = () => {
            expect.fail('Should have never been called');
        };

        const event = {
            pathParameters: {
                id: 'otherId',
            },
            body: JSON.stringify({
                id: 'someId',
                text: 'SomeText',
                state: 'OPEN',
            }),
        };

        const response : APIGatewayProxyResult = await lambdaLocal.execute({
            event,
            lambdaFunc: api,
            lambdaHandler: 'apiUpdateTodo',
        });
        expect(response).to.have.property('statusCode', 400);
        expect(response).to.have.property('body', '');
    });

});
