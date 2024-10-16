import { Context, APIGatewayProxyEvent } from "aws-lambda";
import { Responses } from "../responses";


const lambdaHandler = (lambda: (event: APIGatewayProxyEvent, context: Context) => Promise<any>) => {
  return async (event: APIGatewayProxyEvent, context: Context) => {
    let response: Responses.HttpResponse, statusCode: number, message: string;

    try {
      // Decode the event body if it is base64 encoded
      if (event.isBase64Encoded && event.body) {
        event.body = Buffer.from(event.body, 'base64').toString('utf8');
      }

      response = await lambda(event, context);
    } catch (error) {
      console.error('Error:', error);
      if (error instanceof Error) {
        statusCode = 400;
        message = error.message;
      } else {
        statusCode = 500;
        message = String(error);
      }
      response = Responses.errorHttpResponse(message, statusCode);
    }

    return response;
  };
};

export namespace Utils {
  export const handler = lambdaHandler;
}