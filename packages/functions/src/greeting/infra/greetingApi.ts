import * as aws from "@pulumi/aws";
import * as apigateway from "@pulumi/aws-apigateway";
import greetingHandler from "../handlers/greetingHandler";


// Hello REST API
const greetingApi = new apigateway.RestAPI("greeting-api", {
  description: "API collection for greeting",
  apiKeySource: "HEADER",
  routes: [
    {
      path: "/",
      method: "GET",
      eventHandler: greetingHandler,
      apiKeyRequired: true,
    }
  ]
});

const apiKey = new aws.apigateway.ApiKey("greeting-key");

const usagePlan = new aws.apigateway.UsagePlan("greeting-usage-plan", {
  apiStages: [{
    apiId: greetingApi.api.id,
    stage: greetingApi.stage.stageName,
  }],
});

const usagePlanKey = new aws.apigateway.UsagePlanKey("greeting-usage-plan-key", {
    keyId: apiKey.id,
    keyType: "API_KEY",
    usagePlanId: usagePlan.id,
  },
);

export { greetingApi, apiKey, usagePlanKey };
