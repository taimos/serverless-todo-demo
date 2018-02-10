/**
 {
   id: 'Taskid',
   text: 'Task Description',
   state: 'OPEN'
 }
 */

import AWS from 'aws-sdk';

const save = async todo => {
  let params = {
    Item: todo,
    TableName: process.env.TABLE_NAME
  };
  
  let dynamoClient = new AWS.DynamoDB.DocumentClient();
  await dynamoClient.put(params).promise();
  
  return todo;
};

const scanDynamoDB = async query => {
  
  let dynamoClient = new AWS.DynamoDB.DocumentClient();
  
  let data = await dynamoClient.scan(query).promise();
  
  if (!data.Items) {
    return [];
  }
  let todos = data.Items;
  if (data.LastEvaluatedKey) {
    query.ExclusiveStartKey = data.LastEvaluatedKey;
    let list = await scanDynamoDB(query);
    todos.forEach(item => {
      list.push(item);
    });
    return list;
  }
  return todos;
};

const listTodos = () => {
  return scanDynamoDB({
    'TableName': process.env.TABLE_NAME,
    'Limit': 1000
  });
};

export {save, listTodos};