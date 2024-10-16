import * as apigateway from "@pulumi/aws-apigateway";
import { staticWebBucketEndpoint } from "./staticWebBucket";

const staticWebApi = new apigateway.RestAPI("web-api", {
  description: "API collection for notes",
  apiKeySource: "HEADER",
  routes: [
    {
      path: "/",
      target: {
        type: "http_proxy",
        uri: staticWebBucketEndpoint,
      },
    },
  ]
});

export { staticWebApi };