import * as uuid from "uuid";

export namespace GreetingCore {
  export function hello() {
    return `[${uuid.v4()}] Hello, world!`;
  }
}