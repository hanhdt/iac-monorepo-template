import { uploadsBucket, notesTable } from './notesStorage';
import { notesAPI } from "./notesApi";

export namespace Notes {
  export const uploads = uploadsBucket;
  export const api = notesAPI;
  export const table = notesTable;
}