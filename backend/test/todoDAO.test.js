import AWS from 'aws-sdk-mock';
import 'should';
import lambdaLocal from 'lambda-local';
import {listTodos, save} from '../data/todo';

lambdaLocal.getLogger().level = 'error';
process.env.TABLE_NAME = 'SomeTable';

describe('Test ToDo DAO - save', () => {
  it('should save todo', async () => {
    
    AWS.mock('DynamoDB.DocumentClient', 'put', (params, callback) => {
      params.should.be.an.Object();
      params.should.have.property('Item');
      params.Item.should.have.property('id', 'todoId');
      params.Item.should.have.property('text', 'ToDoText');
      params.Item.should.have.property('state', 'OPEN');
      params.should.have.property('TableName', 'SomeTable');
      
      callback(null, {});
    });
    
    let todo = await save({
      id: 'todoId',
      text: 'ToDoText',
      state: 'OPEN'
    });
    
    todo.should.have.property('id', 'todoId');
    todo.should.have.property('text', 'ToDoText');
    todo.should.have.property('state', 'OPEN');
  });
  
  afterEach(() => {
    AWS.restore();
  });
  
});

describe('Test ToDo DAO - list', () => {
  it('should list todos', async () => {
    
    AWS.mock('DynamoDB.DocumentClient', 'scan', (params, callback) => {
      params.should.be.an.Object();
      params.should.have.property('TableName', 'SomeTable');
      params.should.have.property('Limit', 1000);
      
      callback(null, {
        Items: [
          {
            id: 'todoId',
            text: 'ToDoText',
            state: 'OPEN'
          }
        ]
      });
    });
    
    let list = await listTodos();
    list.should.be.an.Array();
    list.should.have.size(1);
    list[0].should.have.property('id', 'todoId');
    list[0].should.have.property('text', 'ToDoText');
    list[0].should.have.property('state', 'OPEN');
  });
  
  it('should handle empty list', async () => {
    
    AWS.mock('DynamoDB.DocumentClient', 'scan', (params, callback) => {
      params.should.be.an.Object();
      params.should.have.property('TableName', 'SomeTable');
      params.should.have.property('Limit', 1000);
      
      callback(null, {});
    });
    
    let list = await listTodos();
    list.should.be.an.Array();
    list.should.have.size(0);
  });
  
  
  it('should list todos with paging', async () => {
    let queryCount = 0;
    
    AWS.mock('DynamoDB.DocumentClient', 'scan', (params, callback) => {
      params.should.be.an.Object();
      params.should.have.property('TableName', 'SomeTable');
      params.should.have.property('Limit', 1000);
      if (queryCount === 0) {
        params.should.not.have.property('ExclusiveStartKey');
      } else {
        params.should.have.property('ExclusiveStartKey', 'lastKey');
      }
      
      let result = {
        Items: [
          {
            id: 'todoId',
            text: `ToDoText${queryCount}`,
            state: 'OPEN'
          }
        ]
      };
      if (queryCount === 0) {
        result.LastEvaluatedKey = 'lastKey';
        queryCount = 1;
      }
      callback(null, result);
    });
    
    let list = await listTodos();
    list.should.be.an.Array();
    list.should.have.size(2);
    
    list[0].should.have.property('id', 'todoId');
    list[0].should.have.property('text', 'ToDoText1');
    list[0].should.have.property('state', 'OPEN');
    
    list[1].should.have.property('id', 'todoId');
    list[1].should.have.property('text', 'ToDoText0');
    list[1].should.have.property('state', 'OPEN');
    
    queryCount.should.be.equal(1);
  });
  
  afterEach(() => {
    AWS.restore();
  });
  
});