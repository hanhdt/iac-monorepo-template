import * as apigateway from "@pulumi/aws-apigateway";
import { greetingHandler } from "@pl-monorepo-template/functions/greeting";
import { webBucketEndpoint } from "./web";


// Notes REST API
const notesAPI = new apigateway.RestAPI("notes-api", {
  description: "API collection for notes",
  routes: [
    {
      path: "/",
      target: {
        type: "http_proxy",
        uri: webBucketEndpoint,
      },
    },
    {
      path: "/greeting",
      method: "GET",
      eventHandler: greetingHandler,
    }
  ]
});

// Export the Notes REST API
export { notesAPI };