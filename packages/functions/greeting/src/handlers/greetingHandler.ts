import * as aws from "@pulumi/aws";
import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { GreetingCore } from "@iac-monorepo-template/core/greeting";
import { Responses } from "@iac-monorepo-template/core/responses";
import { Utils } from "@iac-monorepo-template/core/utils";

const main = Utils.handler(async (_event: APIGatewayProxyEvent, _context: Context) => {
  const message = `${GreetingCore.hello()} from functions package!`;
  return Responses.successHttpResponse({ message });
});

const greetingHandler = new aws.lambda.CallbackFunction("greetingHandler", {
  callback: main,
});

export default greetingHandler;
