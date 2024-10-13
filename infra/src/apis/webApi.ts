import * as apigateway from "@pulumi/aws-apigateway";
import { Storages } from "../storages";

const webAPI = new apigateway.RestAPI("web-api", {
  description: "API collection for notes",
  apiKeySource: "HEADER",
  routes: [
    {
      path: "/",
      target: {
        type: "http_proxy",
        uri: Storages.web.webBucketEndpoint,
      },
    },
  ]
});

export { webAPI };