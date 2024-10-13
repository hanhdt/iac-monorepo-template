import * as aws from "@pulumi/aws";
import * as apigateway from "@pulumi/aws-apigateway";

import { Greeting } from "@pl-monorepo-template/functions/greeting";
import { webBucketEndpoint } from "./web";

const greetingHandler = new aws.lambda.CallbackFunction("greetingHandler", {
  callback: Greeting.handler,
});

// Notes REST API
const notesAPI = new apigateway.RestAPI("notes-api", {
  description: "API collection for notes",
  apiKeySource: "HEADER",
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
      apiKeyRequired: true,
    }
  ]
});

const apiKey = new aws.apigateway.ApiKey("notes-key");

const usagePlan = new aws.apigateway.UsagePlan("notes-usage-plan", {
  apiStages: [{
    apiId: notesAPI.api.id,
    stage: notesAPI.stage.stageName,
  }],
});

const usagePlanKey = new aws.apigateway.UsagePlanKey("notes-usage-plan-key", {
  keyId: apiKey.id,
  keyType: "API_KEY",
  usagePlanId: usagePlan.id,
},
);

// Export the Notes REST API
export { notesAPI, apiKey, usagePlanKey };