import { Context, APIGatewayProxyEvent } from "aws-lambda";
import { Responses } from "../responses";


const lambdaHandler = (lambda: (event: APIGatewayProxyEvent, context: Context) => Promise<any>) => {
  return async (event: APIGatewayProxyEvent, context: Context) => {
    let response: Responses.HttpResponse, statusCode: number, message: string;

    try {
      response = await lambda(event, context);
    } catch (error) {
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

export namespace Util {
  export const handler = lambdaHandler;
}