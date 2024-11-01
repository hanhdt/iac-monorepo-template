import * as aws from "@pulumi/aws";
import * as apigateway from "@pulumi/aws-apigateway";

import routes from "./routes";

// Notes REST API
const notesAPI = new apigateway.RestAPI("notes-api", {
  description: "API collection for notes",
  apiKeySource: "HEADER",
  routes: routes,
});

const apiKey = new aws.apigateway.ApiKey("notes-key", {
  description: "API Key for notes API",
}, { dependsOn: notesAPI });

const usagePlan = new aws.apigateway.UsagePlan("notes-usage-plan", {
  apiStages: [{
    apiId: notesAPI.api.id,
    stage: notesAPI.stage.stageName,
  }],
}, { dependsOn: notesAPI });

const usagePlanKey = new aws.apigateway.UsagePlanKey("notes-usage-plan-key", {
  keyId: apiKey.id,
  keyType: "API_KEY",
  usagePlanId: usagePlan.id,
}, { dependsOn: [usagePlan, apiKey] });

export { notesAPI, apiKey, usagePlanKey };
