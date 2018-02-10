import proxyquire from 'proxyquire';
import should from 'should';
import lambdaLocal from 'lambda-local';

lambdaLocal.getLogger().level = 'error';

const todoStub = {};
const uuidStub = {};

const getAPI = proxyquire('../api/getTodos', {'../data/todo': todoStub});
const addAPI = proxyquire('../api/addTodo', {'../data/todo': todoStub, 'node-uuid': uuidStub});
const updateAPI = proxyquire('../api/updateTodo', {'../data/todo': todoStub});

describe('GetAPI', () => {
  beforeEach(() => {
    delete todoStub.listTodos;
  });
  
  it('should return list of todos', async () => {
    todoStub.listTodos = () => {
      return Promise.resolve([{
        id: 'SomeId',
        text: 'Todo text',
        state: 'OPEN'
      }]);
    };
    
    let response = await lambdaLocal.execute({
      event: {},
      lambdaFunc: getAPI,
      lambdaHandler: 'default'
    });
    
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

describe('AddAPI', function () {
  beforeEach(() => {
    delete todoStub.save;
  });
  
  it('should save new todo', async () => {
    uuidStub.v4 = () => 'randomID';
    todoStub.save = (todo) => {
      todo.should.have.property('id', 'randomID');
      todo.should.have.property('text', 'SomeText');
      todo.should.have.property('state', 'OPEN');
      return Promise.resolve(todo);
    };
    
    let event = {
      body: JSON.stringify({
        text: 'SomeText',
        state: 'OPEN'
      })
    };
    
    let response = await lambdaLocal.execute({
      event: event,
      lambdaFunc: addAPI,
      lambdaHandler: 'default'
    });
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

describe('UpdateAPI', function () {
  beforeEach(() => {
    delete todoStub.save;
  });
  
  it('should update todo', async () => {
    todoStub.save = (todo) => {
      todo.should.have.property('id', 'someId');
      todo.should.have.property('text', 'SomeText');
      todo.should.have.property('state', 'OPEN');
      return Promise.resolve(todo);
    };
    
    let event = {
      pathParameters: {
        id: 'someId'
      },
      body: JSON.stringify({
        id: 'someId',
        text: 'SomeText',
        state: 'OPEN'
      })
    };
    
    let response = await lambdaLocal.execute({
      event: event,
      lambdaFunc: updateAPI,
      lambdaHandler: 'default'
    });
    response.should.have.property('statusCode', '200');
    response.should.have.property('body');
    let todo = JSON.parse(response.body);
    todo.should.be.an.Object();
    todo.should.have.property('id', 'someId');
    todo.should.have.property('text', 'SomeText');
    todo.should.have.property('state', 'OPEN');
  });
  
  it('should fail for invalid id', async () => {
    todoStub.save = () => {
      should.fail('Should have never been called');
    };
    
    let event = {
      pathParameters: {
        id: 'otherId'
      },
      body: JSON.stringify({
        id: 'someId',
        text: 'SomeText',
        state: 'OPEN'
      })
    };
    
    let response = await lambdaLocal.execute({
      event: event,
      lambdaFunc: updateAPI,
      lambdaHandler: 'default'
    });
    response.should.have.property('statusCode', '400');
    response.should.not.have.property('body');
  });
  
});