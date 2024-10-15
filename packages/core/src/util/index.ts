import { Context, APIGatewayProxyEvent } from "aws-lambda";
import { HttpResponse, errorHttpResponse } from "@iac-monorepo-template/core/responses";

const main = (lambda: (event: APIGatewayProxyEvent, context: Context) => Promise<any>) => {
  return async (event: APIGatewayProxyEvent, context: Context) => {
    let response: HttpResponse, statusCode: number, message: string;

    try {
      response = await lambda(event, context);
    } catch (error) {
      if (error instanceof Error) {
        message = error.message;
      } else {
        message = String(error);
      }
      response = errorHttpResponse(message, 500);
    }

    return response;
  };
};

export namespace Util {
  export const handler = main;
}