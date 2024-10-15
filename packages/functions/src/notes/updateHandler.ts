import * as aws from "@pulumi/aws";
import { APIGatewayProxyEvent } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  UpdateCommand,
  UpdateCommandInput,
  DynamoDBDocumentClient
} from "@aws-sdk/lib-dynamodb";
import { Util } from "@iac-monorepo-template/core/util";
import { Responses } from "@iac-monorepo-template/core/responses";

const main = Util.handler(async (event: APIGatewayProxyEvent, _context: any) => {
  console.log('Event:', JSON.stringify(event));

  const notesTableName = process.env.NOTES_TABLE_NAME ?? 'notes';
  const { content, attachment, title } = JSON.parse(event.body ?? '{}');

  const params: UpdateCommandInput = {
    TableName: notesTableName,
    Key: {
      userId: 'abcd123',
      noteId: event.pathParameters?.id,
    },
    UpdateExpression: 'SET content = :content, attachment = :attachment, title = :title',
    ExpressionAttributeValues: {
      ':content': content,
      ':attachment': attachment,
      ':title': title,
    },
    ReturnValues: 'ALL_NEW',
  };

  const dynamoDb = DynamoDBDocumentClient.from(new DynamoDBClient({}));
  const result = await dynamoDb.send(new UpdateCommand(params));

  return Responses.successHttpResponse(result.Attributes);
});

const updateNoteHandler = new aws.lambda.CallbackFunction("updateNoteHandler", {
  callback: main,
});

export default updateNoteHandler;