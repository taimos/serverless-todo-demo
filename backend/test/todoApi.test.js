const proxyquire = require('proxyquire');
const should = require('should');
const lambdaLocal = require('lambda-local');
lambdaLocal.getLogger().level = 'error';

const todoStub = {};
const uuidStub = {};
const getAPI = proxyquire('../api/getTodos', {'../data/todo': todoStub});
const addAPI = proxyquire('../api/addTodo', {'../data/todo': todoStub, 'node-uuid': uuidStub});
const updateAPI = proxyquire('../api/updateTodo', {'../data/todo': todoStub});

describe('GetAPI', function () {
  'use strict';
  
  beforeEach(function () {
    delete todoStub.listTodos;
  });
  
  it('should return list of todos', function () {
    
    todoStub.listTodos = () => {
      return Promise.resolve([{
        id: 'SomeId',
        text: 'Todo text',
        state: 'OPEN'
      }]);
    };
    
    return callAPI(getAPI, 'handler', {}).then(response => {
      response.should.have.property('statusCode', '200');
      response.should.have.property('body');
      let list = JSON.parse(response.body);
      list.should.have.size(1);
      list[0].should.be.an.Object();
      list[0].should.have.property('id', 'SomeId');
      list[0].should.have.property('text', 'Todo text');
      list[0].should.have.property('state', 'OPEN');
    });
  });
  
});

describe('AddAPI', function () {
  'use strict';
  
  beforeEach(function () {
    delete todoStub.save;
  });
  
  it('should save new todo', function () {
    
    uuidStub.v4 = () => 'randomID';
    
    todoStub.save = (todo) => {
      todo.should.have.property('id', 'randomID');
      todo.should.have.property('text', 'SomeText');
      todo.should.have.property('state', 'OPEN');
      return Promise.resolve(todo);
    };
    
    let todo = {
      text: 'SomeText',
      state: 'OPEN'
    };
    let event = {
      body: JSON.stringify(todo)
    };
    
    return callAPI(addAPI, 'handler', event).then(response => {
      response.should.have.property('statusCode', '201');
      response.should.have.property('headers');
      response.headers.should.have.property('Location', '/todos/randomID');
      response.should.have.property('body');
      let todo = JSON.parse(response.body);
      todo.should.be.an.Object();
      todo.should.have.property('id', 'randomID');
      todo.should.have.property('text', 'SomeText');
      todo.should.have.property('state', 'OPEN');
    });
  });
  
});

describe('UpdateAPI', function () {
  'use strict';
  
  beforeEach(function () {
    delete todoStub.save;
  });
  
  
  it('should update todo', function () {
    
    todoStub.save = (todo) => {
      todo.should.have.property('id', 'someId');
      todo.should.have.property('text', 'SomeText');
      todo.should.have.property('state', 'OPEN');
      return Promise.resolve(todo);
    };
    
    let todo = {
      id: 'someId',
      text: 'SomeText',
      state: 'OPEN'
    };
    let event = {
      pathParameters: {
        id: 'someId'
      },
      body: JSON.stringify(todo)
    };
    
    return callAPI(updateAPI, 'handler', event).then(response => {
      response.should.have.property('statusCode', '200');
      response.should.have.property('body');
      let todo = JSON.parse(response.body);
      todo.should.be.an.Object();
      todo.should.have.property('id', 'someId');
      todo.should.have.property('text', 'SomeText');
      todo.should.have.property('state', 'OPEN');
    });
  });
  
  it('should fail for invalid id', function () {
    
    todoStub.save = () => {
      should.fail('Should have never been called');
    };
    
    let todo = {
      id: 'someId',
      text: 'SomeText',
      state: 'OPEN'
    };
    let event = {
      pathParameters: {
        id: 'otherId'
      },
      body: JSON.stringify(todo)
    };
    
    return callAPI(updateAPI, 'handler', event).then(response => {
      response.should.have.property('statusCode', '400');
      response.should.not.have.property('body');
    });
  });
  
});

const callAPI = (fn, handler, event) => {
  'use strict';
  
  return new Promise((resolve, reject) => {
    lambdaLocal.execute({
      event: event,
      lambdaFunc: fn,
      lambdaHandler: handler,
      callback: function (err, data) {
        if (err) {
          reject(err);
        }
        resolve(data);
      }
    });
  });
};