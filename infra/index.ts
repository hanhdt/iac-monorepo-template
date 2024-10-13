import { bucket } from "./src/storages";
import { webBucket, webBucketEndpoint } from "./src/web";
import { notesAPI, apiKey } from "./src/api";

const notesBucketId = bucket.id;
const webBucketId = webBucket.id;
const notesAPIUrl = notesAPI.url;
const notesAPIKey = apiKey.value;

export {
  notesBucketId,
  webBucketId,
  webBucketEndpoint,
  notesAPIUrl,
  notesAPIKey,
};
