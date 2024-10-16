import { Greeting } from "./src/greeting";
import { Notes } from "./src/notes";

const greetingAPIUrl = Greeting.infra.api.url;

const notesUploadBucketId = Notes.infra.s3Uploads.id;
const notesAPIUrl = Notes.infra.api.url;
const notesTableName = Notes.infra.ddbTable.name;

export { greetingAPIUrl, notesUploadBucketId, notesAPIUrl, notesTableName };