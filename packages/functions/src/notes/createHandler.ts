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
} from "@iac-monorepo-template/core/responses";
import { Util } from "@iac-monorepo-template/core/util";


const main = Util.handler(async (event: APIGatewayProxyEvent, _context: any) => {
  let data = {
    title: '',
    content: '',
    attachment: '',
  };
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

  const client = new DynamoDBClient({ region: `${aws.getRegion()}` });
  await client.send(new PutItemCommand(params));

  return successHttpResponse(params.Item);
});

const createNoteHandler = new aws.lambda.CallbackFunction("createNoteHandler", {
  callback: main,
});

export default createNoteHandler;