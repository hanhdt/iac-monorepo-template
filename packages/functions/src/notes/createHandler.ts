import * as aws from "@pulumi/aws";
import * as uuid from 'uuid';
import { APIGatewayProxyEvent } from "aws-lambda";
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { PutCommand, PutCommandInput, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import {
  Responses
} from "@iac-monorepo-template/core/responses";
import { Util } from "@iac-monorepo-template/core/util";


const main = Util.handler(async (event: APIGatewayProxyEvent, _context: any) => {
  let data = {
    title: '',
    content: '',
    attachment: '',
  };
  let params: PutCommandInput;

  if (event.body) {
    const notesTableName = Util.stackOutput('notesTableName');
    console.log('dynamoDbTableName:', notesTableName);
    data = JSON.parse(event.body);
    params = {
      TableName: notesTableName ?? 'notes',
      Item: {
        userId: { S: "123" },
        noteId: { S: uuid.v4() },
        title: { S: data.title },
        content: { S: data.content },
        attachment: { S: data.attachment },
        createdAt: { S: new Date().toISOString() },
      },
    };
  } else {
    return Responses.errorHttpResponse('No data provided', 400);
  }

  const client = DynamoDBDocumentClient.from(new DynamoDBClient({region: `${aws.getRegion()}`}));
  await client.send(new PutCommand(params));

  return Responses.successHttpResponse(params.Item);
});

const createNoteHandler = new aws.lambda.CallbackFunction("createNoteHandler", {
  callback: main,
});

export default createNoteHandler;