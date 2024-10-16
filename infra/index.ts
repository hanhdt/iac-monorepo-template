import { IntroWeb } from "./src/introWeb";
import { HelloWorld } from "./src/helloWorld";
import { Notes } from "./src/notes";
import { Auth } from "./src/auth";


const introWebBucketId = IntroWeb.html.introWebBucket.id;
const introWebAPIUrl = IntroWeb.api.url;

const helloWorldAPIUrl = HelloWorld.api.url;

const notesUploadBucketId = Notes.uploads.id;
const notesAPIUrl = Notes.api.url;
const notesTableName = Notes.table.name;

const userPoolId = Auth.UserPool.id;
const userPoolClientId = Auth.UserPoolClient.id;
const identityPoolId = Auth.IdentityPool.id;

export {
  introWebBucketId,
  introWebAPIUrl,
  helloWorldAPIUrl,
  notesAPIUrl,
  notesUploadBucketId,
  notesTableName,
  userPoolId,
  userPoolClientId,
  identityPoolId,
};
