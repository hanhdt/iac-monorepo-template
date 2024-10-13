import { uploadsBucket } from './uploadsBucket';
import { notesAPI } from "./notesApi";

export namespace Notes {
  export const uploads = uploadsBucket;
  export const api = notesAPI;
}