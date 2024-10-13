import * as apigateway from "@pulumi/aws-apigateway";
import { introWebBucketEndpoint } from "./introWebBucket";

const introWebAPI = new apigateway.RestAPI("web-api", {
  description: "API collection for notes",
  apiKeySource: "HEADER",
  routes: [
    {
      path: "/",
      target: {
        type: "http_proxy",
        uri: introWebBucketEndpoint,
      },
    },
  ]
});

export { introWebAPI };