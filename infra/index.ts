import { Storages } from "./src/storages";
import { APIs } from "./src/apis";

const notesUploadBucketId = Storages.uploads.id;
const webBucketId = Storages.web.webBucket.id;
const webBucketEndpoint = Storages.web.webBucketEndpoint;
const notesAPIUrl = APIs.notes.notesAPI.url;

export {
  notesUploadBucketId,
  notesAPIUrl,
  webBucketId,
  webBucketEndpoint,
};
