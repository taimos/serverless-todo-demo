import * as AWS from 'aws-sdk-mock';
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';
import { expect } from 'chai';
import * as lambdaLocal from 'lambda-local';
import ScanOutput = DocumentClient.ScanOutput;
import PutItemInput = DocumentClient.PutItemInput;
import ScanInput = DocumentClient.ScanInput;
import { env } from 'process';
import { listTodos, save, ToDo } from '../lib/data';

lambdaLocal.getLogger().level = 'error';
env.TABLE_NAME = 'SomeTable';

describe('Test ToDo DAO - save', () => {

    it('should save todo', async () => {

        AWS.mock('DynamoDB.DocumentClient', 'put', (params : PutItemInput, callback) => {
            expect(params).to.haveOwnProperty('Item');
            expect(params.Item).to.have.property('id', 'todoId');
            expect(params.Item).to.have.property('text', 'ToDoText');
            expect(params.Item).to.have.property('state', 'OPEN');
            expect(params).to.have.property('TableName', 'SomeTable');
            callback(null, {});
        });

        const todo : ToDo = await save({
            id: 'todoId',
            text: 'ToDoText',
            state: 'OPEN',
        });

        expect(todo).to.have.property('id', 'todoId');
        expect(todo).to.have.property('text', 'ToDoText');
        expect(todo).to.have.property('state', 'OPEN');
    });

    afterEach(() => {
        AWS.restore();
    });

});

describe('Test ToDo DAO - list', () => {
    it('should list todos', async () => {

        AWS.mock('DynamoDB.DocumentClient', 'scan', (params, callback) => {
            expect(params).to.be.an('object');
            expect(params).to.have.property('TableName', 'SomeTable');
            expect(params).to.have.property('Limit', 1000);
            callback(null, {
                Items: [
                    {
                        id: 'todoId',
                        text: 'ToDoText',
                        state: 'OPEN',
                    },
                ],
            });
        });

        const list : ToDo[] = await listTodos();
        expect(list).to.be.an('array').that.has.lengthOf(1);
        expect(list[0]).to.have.property('id', 'todoId');
        expect(list[0]).to.have.property('text', 'ToDoText');
        expect(list[0]).to.have.property('state', 'OPEN');
    });

    it('should handle empty list', async () => {

        AWS.mock('DynamoDB.DocumentClient', 'scan', (params, callback) => {
            expect(params).to.be.an('object');
            expect(params).to.have.property('TableName', 'SomeTable');
            expect(params).to.have.property('Limit', 1000);
            callback(null, {});
        });

        const list : ToDo[] = await listTodos();
        expect(list).to.be.an('array');
        expect(list).to.have.lengthOf(0);
    });

    it('should list todos with paging', async () => {
        let queryCount = 0;

        AWS.mock('DynamoDB.DocumentClient', 'scan', (params : ScanInput, callback) => {
            expect(params).to.be.an('object');
            expect(params).to.have.property('TableName', 'SomeTable');
            expect(params).to.have.property('Limit', 1000);
            if (queryCount === 0) {
                expect(params).to.not.have.property('ExclusiveStartKey');
            } else {
                expect(params).to.have.property('ExclusiveStartKey');
                expect(params.ExclusiveStartKey).to.have.property('id', 'lastKey');
            }

            const result : ScanOutput = {
                Items: [
                    {
                        id: 'todoId',
                        text: `ToDoText${queryCount}`,
                        state: 'OPEN',
                    },
                ],
            };
            if (queryCount === 0) {
                result.LastEvaluatedKey = {
                    id: 'lastKey',
                };
                queryCount = 1;
            }
            callback(null, result);
        });

        const list : ToDo[] = await listTodos();
        expect(list).to.be.an('array').that.has.lengthOf(2);

        expect(list[0]).to.have.property('id', 'todoId');
        expect(list[0]).to.have.property('text', 'ToDoText1');
        expect(list[0]).to.have.property('state', 'OPEN');

        expect(list[1]).to.have.property('id', 'todoId');
        expect(list[1]).to.have.property('text', 'ToDoText0');
        expect(list[1]).to.have.property('state', 'OPEN');

        expect(queryCount).to.be.equal(1);
    });

    afterEach(() => {
        AWS.restore();
    });

});
