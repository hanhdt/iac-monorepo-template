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
  console.log('Event:', JSON.stringify(event));
  let data = {
    title: '',
    content: '',
    attachment: '',
  };
  let params: PutCommandInput;
  if (event.body) {
    const notesTableName = process.env.NOTES_TABLE_NAME ?? 'notes';
    data = JSON.parse(event.body);
    params = {
      TableName: notesTableName,
      Item: {
        userId: "abcd123",
        noteId: uuid.v4(),
        title: data.title,
        content: data.content,
        attachment: data.attachment,
        createdAt: new Date().toISOString(),
      },
    };
  } else {
    return Responses.errorHttpResponse('No data provided', 400);
  }

  const client = DynamoDBDocumentClient.from(new DynamoDBClient({}));
  await client.send(new PutCommand(params));

  return Responses.successHttpResponse(params.Item);
});

const createNoteHandler = new aws.lambda.CallbackFunction("createNoteHandler", {
  callback: main,
});

export default createNoteHandler;