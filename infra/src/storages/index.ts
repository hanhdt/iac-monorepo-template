import { uploadsBucket } from './uploadsBucket';
import * as webBucket from './webBucket';

export namespace Storages {
  export const uploads = uploadsBucket;
  export const web = webBucket;
}