import { uploadsBucket, notesTable } from "./notesStorage";
import { notesAPI } from "./notesApi";

export namespace NotesInfra {
  export const api = notesAPI;
  export const s3Uploads = uploadsBucket;
  export const ddbTable = notesTable;
}