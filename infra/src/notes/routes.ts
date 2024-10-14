import * as aws from "@pulumi/aws";
import * as apigateway from "@pulumi/aws-apigateway";
import { Notes } from "@iac-monorepo-template/functions/notes";

// Export the Notes routes
const routes: apigateway.types.input.RouteArgs[] = [
  {
    path: "/notes",
    method: "GET",
    eventHandler: new aws.lambda.CallbackFunction("getNotesHandler", {
      callback: async (_event: any) => {
        return {
          statusCode: 200,
          body: JSON.stringify({ message: "GET /notes" }),
        };
      },
    }),
    apiKeyRequired: true,
  },
  {
    path: "/notes",
    method: "POST",
    eventHandler: Notes.createHandler,
    apiKeyRequired: true,
  }
];

export default routes;