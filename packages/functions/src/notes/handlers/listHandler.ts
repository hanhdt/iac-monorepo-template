import * as aws from "@pulumi/aws";
import { APIGatewayProxyEvent } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { QueryCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { Util } from "@iac-monorepo-template/core/util";
import { Responses } from "@iac-monorepo-template/core/responses";

const main = Util.handler(async (event: APIGatewayProxyEvent, _context: any) => {
  console.log('Event:', JSON.stringify(event));

  const notesTableName = process.env.NOTES_TABLE_NAME ?? 'notes';
  const params = {
    TableName: notesTableName,
    KeyConditionExpression: 'userId = :userId',
    ExpressionAttributeValues: {
      ':userId': 'abcd123',
    },
  };

  const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
  const result = await dynamoDb.send(new QueryCommand(params));

  return Responses.successHttpResponse(result.Items);
});

const listNotesHandler = new aws.lambda.CallbackFunction("listNotesHandler", {
  callback: main,
});

export default listNotesHandler;