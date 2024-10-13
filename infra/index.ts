import { IntroWeb } from "./src/introWeb";
import { HelloWorld } from "./src/helloWorld";
import { Notes } from "./src/notes";


const introWebBucketId = IntroWeb.html.introWebBucket.id;
const introWebAPIUrl = IntroWeb.api.url;

const helloWorldAPIUrl = HelloWorld.api.url;

const notesUploadBucketId = Notes.uploads.id;
const notesAPIUrl = Notes.api.url;

export {
  introWebBucketId,
  introWebAPIUrl,
  helloWorldAPIUrl,
  notesAPIUrl,
  notesUploadBucketId,
};
