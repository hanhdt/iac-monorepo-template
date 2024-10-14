import * as aws from "@pulumi/aws";
import * as apigateway from "@pulumi/aws-apigateway";
import { Greeting } from "@iac-monorepo-template/functions/greeting";


// Hello REST API
const helloApi = new apigateway.RestAPI("hello-api", {
  description: "API collection for greeting",
  apiKeySource: "HEADER",
  routes: [
    {
      path: "/",
      method: "GET",
      eventHandler: Greeting.handler,
      apiKeyRequired: true,
    }
  ]
});

const apiKey = new aws.apigateway.ApiKey("hello-key");

const usagePlan = new aws.apigateway.UsagePlan("hello-usage-plan", {
  apiStages: [{
    apiId: helloApi.api.id,
    stage: helloApi.stage.stageName,
  }],
});

const usagePlanKey = new aws.apigateway.UsagePlanKey("hello-usage-plan-key", {
    keyId: apiKey.id,
    keyType: "API_KEY",
    usagePlanId: usagePlan.id,
  },
);

export { helloApi, apiKey, usagePlanKey };
