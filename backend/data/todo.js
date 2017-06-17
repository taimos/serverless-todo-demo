/**
 {
   id: 'Taskid',
   text: 'Task Description',
   state: 'OPEN'
 }
 */

const AWS = require('aws-sdk');

exports.save = todo => {
  'use strict';
  let params = {
    Item: todo,
    TableName: process.env.TABLE_NAME
  };
  let dynamoClient = new AWS.DynamoDB.DocumentClient();
  return dynamoClient.put(params).promise().then(() => {
    // return saved todo
    return todo;
  });
};

const scanDynamoDB = query => {
  'use strict';
  
  let dynamoClient = new AWS.DynamoDB.DocumentClient();
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
    'TableName': process.env.TABLE_NAME,
    'Limit': 1000
  });
};