/**
 {
   id: 'Taskid',
   text: 'Task Description',
   state: 'OPEN'
 }
 */

const TableName = process.env.TABLE_NAME;
const AWS = require('aws-sdk');
const dynamoClient = new AWS.DynamoDB.DocumentClient();

exports.save = todo => {
  'use strict';
  let params = {
    Item: todo,
    TableName: TableName
  };
  return dynamoClient.put(params).promise().then(() => {
    // return saved todo
    return todo;
  });
};

exports.getById = id => {
  'use strict';
  
  let params = {
    Key: {
      id: id
    },
    TableName: TableName
  };
  return dynamoClient.get(params).promise().then(data => {
    if (!data.Item) {
      return Promise.reject();
    }
    return data.Item;
  });
};


const scanDynamoDB = query => {
  'use strict';
  return dynamoClient.scan(query).promise().then(data => {
    if (!data.Items) {
      return [];
    }
    let todos = data.Items;
    if (data.LastEvaluatedKey) {
      query.ExclusiveStartKey = data.LastEvaluatedKey;
      return scanDynamoDB(query).then(list => {
        todos.forEach(item => {
          list.push(item);
        });
        return list;
      });
    }
    return todos;
  });
};

exports.listTodos = () => {
  'use strict';
  
  return scanDynamoDB({
    'TableName': TableName,
    'Limit': 1000
  });
};