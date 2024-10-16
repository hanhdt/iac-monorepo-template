import * as apigateway from "@pulumi/aws-apigateway";
import { NoteHandlers as Notes } from "../src/handlers";

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
  },
  {
    path: "/notes/{id}",
    method: "PUT",
    eventHandler: Notes.updateHandler,
    apiKeyRequired: true,
  },
  {
    path: "/notes/{id}",
    method: "DELETE",
    eventHandler: Notes.deleteHandler,
    apiKeyRequired: true,
  }
];

export default routes;