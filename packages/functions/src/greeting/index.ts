import * as aws from "@pulumi/aws";
import { Example } from "@pl-monorepo-template/core/example";

const handler = async (_event: any, _context: any) => {
  return {
    statusCode: 200,
    body: `${Example.hello()} from ${aws.getRegion()}!`,
  }
};

const greetingHandler = new aws.lambda.CallbackFunction("greetingHandler", {
  callback: handler,
});

export namespace Greeting {
  export const handler = greetingHandler;
}
