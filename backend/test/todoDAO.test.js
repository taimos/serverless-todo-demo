const should = require('should');
const dao = require('../data/todo');
const AWS = require('aws-sdk-mock');

process.env.TABLE_NAME = 'SomeTable';

describe('Test ToDo DAO - get', () => {
  'use strict';
  
  it('should return todo by id', () => {
    
    AWS.mock('DynamoDB.DocumentClient', 'get', (params, callback) => {
      params.should.be.an.Object();
      params.should.have.property('Key');
      params.Key.should.have.property('id', 'todoId');
      params.should.have.property('TableName', 'SomeTable');
      
      callback(null, {
        Item: {
          id: 'todoId',
          text: 'ToDoText',
          state: 'OPEN'
        }
      });
    });
    
    return dao.getById('todoId').then(todo => {
      todo.should.have.property('id', 'todoId');
      todo.should.have.property('text', 'ToDoText');
      todo.should.have.property('state', 'OPEN');
    });
  });
  
  it('should fail on invalid todo', () => {
    
    AWS.mock('DynamoDB.DocumentClient', 'get', (params, callback) => {
      params.should.be.an.Object();
      params.should.have.property('Key');
      params.Key.should.have.property('id', 'invalidId');
      params.should.have.property('TableName', 'SomeTable');
      
      callback(null, {});
    });
    
    return dao.getById('invalidId').then(() => {
      should.fail();
    }).catch(err => {
      should(err).be.undefined();
    });
  });
  
  
  afterEach(() => {
    AWS.restore();
  });
  
});

describe('Test ToDo DAO - save', () => {
  'use strict';
  
  it('should save todo', () => {
    
    AWS.mock('DynamoDB.DocumentClient', 'put', (params, callback) => {
      params.should.be.an.Object();
      params.should.have.property('Item');
      params.Item.should.have.property('id', 'todoId');
      params.Item.should.have.property('text', 'ToDoText');
      params.Item.should.have.property('state', 'OPEN');
      params.should.have.property('TableName', 'SomeTable');
      
      callback(null, {});
    });
    
    return dao.save({
      id: 'todoId',
      text: 'ToDoText',
      state: 'OPEN'
    }).then(todo => {
      todo.should.have.property('id', 'todoId');
      todo.should.have.property('text', 'ToDoText');
      todo.should.have.property('state', 'OPEN');
    });
  });
  
  afterEach(() => {
    AWS.restore();
  });
  
});

describe('Test ToDo DAO - list', () => {
  'use strict';
  
  it('should list todos', () => {
    
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
    
    return dao.listTodos().then(list => {
      list.should.be.an.Array();
      list.should.have.size(1);
      list[0].should.have.property('id', 'todoId');
      list[0].should.have.property('text', 'ToDoText');
      list[0].should.have.property('state', 'OPEN');
    });
  });
  
  it('should handle empty list', () => {
    
    AWS.mock('DynamoDB.DocumentClient', 'scan', (params, callback) => {
      params.should.be.an.Object();
      params.should.have.property('TableName', 'SomeTable');
      params.should.have.property('Limit', 1000);
      
      callback(null, {});
    });
    
    return dao.listTodos().then(list => {
      list.should.be.an.Array();
      list.should.have.size(0);
    });
  });
  
  
  it('should list todos with paging', () => {
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
    
    return dao.listTodos().then(list => {
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
  });
  
  afterEach(() => {
    AWS.restore();
  });
  
});