import * as aws from "@pulumi/aws";
import { Example } from "@pl-monorepo-template/core/example";

const handler = async (_event: any, _context: any) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `${Example.hello()} from functions package!`,
    }),
  }
};

const greetingHandler = new aws.lambda.CallbackFunction("greetingHandler", {
  callback: handler,
});

export namespace Greeting {
  export const handler = greetingHandler;
}
