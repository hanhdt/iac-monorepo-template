import * as webBucket from './staticWebBucket';
import { staticWebApi } from "./staticWebApi";

export namespace StaticWeb {
  export const html = webBucket;
  export const api = staticWebApi;
}