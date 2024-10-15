import * as aws from "@pulumi/aws";
import { APIGatewayProxyEvent } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { Util } from "@iac-monorepo-template/core/util";
import { Responses } from "@iac-monorepo-template/core/responses";

const main = Util.handler(async (event: APIGatewayProxyEvent, _context: any) => {
  const notesTableName = Util.stackOutput('notesTableName');
  console.log('dynamoDbTableName:', notesTableName);
  const params = {
    TableName: notesTableName ?? 'notes',
    Key: {
      userId: '123',
      noteId: event?.pathParameters?.id,
    },
  };

  const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
  const result = await dynamoDb.send(new GetCommand(params));

  if (!result.Item) {
    throw new Error('Item not found');
  }

  return Responses.successHttpResponse(result.Item);
});

const getNoteHandler = new aws.lambda.CallbackFunction("getNoteHandler", {
  callback: main,
});

export default getNoteHandler;