import * as aws from "@pulumi/aws";
import * as apigateway from "@pulumi/aws-apigateway";
import { Notes } from "@iac-monorepo-template/functions/notes";

// Export the Notes routes
const routes: apigateway.types.input.RouteArgs[] = [
  {
    path: "/notes",
    method: "GET",
    eventHandler: Notes.listHandler,
    apiKeyRequired: true,
  },
  {
    path: "/notes/{id}",
    method: "GET",
    eventHandler: Notes.getHandler,
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