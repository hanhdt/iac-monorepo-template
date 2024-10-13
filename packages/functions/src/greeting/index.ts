import { Example } from "@pl-monorepo-template/core/example";

const greetingHandler = async (_event: any, _context: any) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `${Example.hello()} from functions package!`,
    }),
  }
};

export namespace Greeting {
  export const handler = greetingHandler;
}
