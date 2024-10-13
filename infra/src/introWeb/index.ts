import * as webBucket from './introWebBucket';
import { introWebAPI } from "./introWebApi";

export namespace IntroWeb {
  export const html = webBucket;
  export const api = introWebAPI;
}