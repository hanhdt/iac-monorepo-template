import * as aws from "@pulumi/aws";
import { GreetingCore } from "@iac-monorepo-template/core/greeting";
import { successHttpResponse } from "@iac-monorepo-template/core/utils/responses";

const handler = async (_event: any, _context: any) => {
  const message = `${GreetingCore.hello()} from functions package!`;
  return successHttpResponse({ message });
};

const greetingHandler = new aws.lambda.CallbackFunction("greetingHandler", {
  callback: handler,
});

export namespace GreetingHandler {
  export const handler = greetingHandler;
}
