import * as uuid from "uuid";

export namespace Example {
  export function hello() {
    return `[${uuid.v4()}] Hello, world!`;
  }
}