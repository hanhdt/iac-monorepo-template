import * as aws from "@pulumi/aws";
import { Notes } from "./notes";

const currentRegion = aws.getRegion({});

// Create user pool
const userPool = new aws.cognito.UserPool("UserPool", {
  autoVerifiedAttributes: ["email"],
  usernameAttributes: ["email"],
  schemas: [
    {
      name: "email",
      required: true,
      mutable: false,
      attributeDataType: "String",
    },
  ],
  passwordPolicy: {
    minimumLength: 8,
    requireLowercase: false,
    requireNumbers: false,
    requireSymbols: false,
    requireUppercase: false,
  },
});

// Create user pool client
const userPoolClient = new aws.cognito.UserPoolClient("UserPoolClient", {
  userPoolId: userPool.id,
  generateSecret: false,
  supportedIdentityProviders: ["COGNITO"],
}, { dependsOn: userPool });

// Create identity pool
const identityPool = new aws.cognito.IdentityPool("IdentityPool", {
  allowUnauthenticatedIdentities: false,
  identityPoolName: "IdentityPool",
  cognitoIdentityProviders: [{
    clientId: userPoolClient.id,
    providerName: userPool.id,
  }],
}, { dependsOn: [userPool, userPoolClient] });

// TODO: Specify the resources that the identity pool has access to

export {
  userPool,
  userPoolClient,
  identityPool,
}