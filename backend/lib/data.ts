import { DynamoDB } from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/lib/dynamodb/document_client';
import AttributeMap = DocumentClient.AttributeMap;
import ScanOutput = DocumentClient.ScanOutput;
import PutItemInput = DocumentClient.PutItemInput;
import ScanInput = DocumentClient.ScanInput;

export class ToDo {
    public id : string;
    public text : string;
    public state : string;

    constructor(attr : AttributeMap) {
        this.id = attr.id;
        this.text = attr.text;
        this.state = attr.state;
    }
}

export const save = async (todo : ToDo) : Promise<ToDo> => {
    const params : PutItemInput = {
        Item: todo,
        TableName: process.env.TABLE_NAME,
    };

    const dynamoClient : DocumentClient = new DynamoDB.DocumentClient();
    await dynamoClient.put(params).promise();

    return todo;
};

const scanDynamoDB = async (query : ScanInput) : Promise<ToDo[]> => {
    const dynamoClient : DocumentClient = new DynamoDB.DocumentClient();
    const data : ScanOutput = await dynamoClient.scan(query).promise();

    if (!data.Items) {
        return [];
    }
    const todos : ToDo[] = data.Items.map((attr : AttributeMap) => new ToDo(attr));
    if (data.LastEvaluatedKey) {
        query.ExclusiveStartKey = data.LastEvaluatedKey;
        const list = await scanDynamoDB(query);
        todos.forEach((item : ToDo) => {
            list.push(item);
        });
        return list;
    }
    return todos;
};

export const listTodos = () : Promise<ToDo[]> => {
    return scanDynamoDB({
        TableName: process.env.TABLE_NAME,
        Limit: 1000,
    });
};
