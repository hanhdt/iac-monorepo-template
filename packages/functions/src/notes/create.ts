import * as aws from "@pulumi/aws";
import * as uuid from 'uuid';
import { APIGatewayProxyEvent } from "aws-lambda";
import {
  DynamoDBClient,
  PutItemCommand,
  PutItemCommandInput
} from '@aws-sdk/client-dynamodb';
import {
  successHttpResponse,
  errorHttpResponse
} from "@iac-monorepo-template/core/utils/responses";


const client = new DynamoDBClient({ region: `${aws.getRegion()}` });

const main = async (event: APIGatewayProxyEvent) => {
  let data;
  let params: PutItemCommandInput;

  if (event.body) {
    data = JSON.parse(event.body);
    params = {
      TableName: 'notes',
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
    return errorHttpResponse('No data provided', 400);
  }

  try {
    await client.send(new PutItemCommand(params));

    return successHttpResponse(params.Item);
  } catch (error) {
    let message;
    if (error instanceof Error) {
      message = error.message;
    } else {
      message = String(error);
    }

    return errorHttpResponse(message, 500);
  }
};

const handler = new aws.lambda.CallbackFunction("createHandler", {
  callback: main,
});

export { handler };