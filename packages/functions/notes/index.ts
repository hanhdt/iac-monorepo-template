import { uploadsBucket, notesTable } from "./infra/notesStorage";
import { notesAPI } from "./infra/notesApi";

const notesAPIUrl = notesAPI.url;
const notesUploadBucketId = uploadsBucket.id;
const notesTableName = notesTable.name;

export {
  notesAPIUrl,
  notesUploadBucketId,
  notesTableName,
};