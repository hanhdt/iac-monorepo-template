import * as aws from "@pulumi/aws";
import { APIGatewayProxyEvent } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DeleteCommand,
  DeleteCommandInput,
  DynamoDBDocumentClient
} from "@aws-sdk/lib-dynamodb";
import { Util } from "@iac-monorepo-template/core/util";
import { Responses } from "@iac-monorepo-template/core/responses";


const main = Util.handler(async (event: APIGatewayProxyEvent, _context: any) => {
  console.log('Event:', JSON.stringify(event));

  const notesTableName = process.env.NOTES_TABLE_NAME ?? 'notes';

  const params: DeleteCommandInput = {
    TableName: notesTableName,
    Key: {
      userId: 'abcd123',
      noteId: event.pathParameters?.id,
    },
  };

  const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
  await dynamoDb.send(new DeleteCommand(params));

  return Responses.successHttpResponse({});
});

const deleteNoteHandler = new aws.lambda.CallbackFunction("deleteNoteHandler", {
  callback: main,
});

export default deleteNoteHandler;