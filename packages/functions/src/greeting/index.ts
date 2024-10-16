import greetingHandler from './handlers/greetingHandler';
import { GreetingInfra } from './infra';

export namespace Greeting {
  export const infra = GreetingInfra;
  export const handler = greetingHandler;
}