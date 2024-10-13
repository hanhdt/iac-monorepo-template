// import * as pulumi from "@pulumi/pulumi";
// import * as aws from "@pulumi/aws";
// import * as awsx from "@pulumi/awsx";

import { bucket } from "./src/storages";

// Export the name of the bucket
export const bucketName = bucket.id;
