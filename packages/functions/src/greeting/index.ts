import * as aws from "@pulumi/aws";
import { GreetingCore } from "@iac-monorepo-template/core/greeting";

const handler = async (_event: any, _context: any) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `${GreetingCore.hello()} from functions package!`,
    }),
  }
};

const greetingHandler = new aws.lambda.CallbackFunction("greetingHandler", {
  callback: handler,
});

export namespace GreetingHandler {
  export const handler = greetingHandler;
}
