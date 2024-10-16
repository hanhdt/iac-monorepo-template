import * as aws from "@pulumi/aws";
import { APIGatewayProxyEvent } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { GetCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { Utils } from "@iac-monorepo-template/core/utils";
import { Responses } from "@iac-monorepo-template/core/responses";


const main = Utils.handler(async (event: APIGatewayProxyEvent, _context: any) => {
  console.log('Event:', JSON.stringify(event));

  const notesTableName = process.env.NOTES_TABLE_NAME ?? 'notes';
  const params = {
    TableName: notesTableName,
    Key: {
      userId: 'abcd123',
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