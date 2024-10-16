import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

// Create an S3 Bucket
const staticWebBucket = new aws.s3.Bucket("notes-frontend", {
  website: {
    indexDocument: "index.html",
  },
});

const ownershipControls = new aws.s3.BucketOwnershipControls("ownershipControls", {
  bucket: staticWebBucket.bucket,
  rule: {
    objectOwnership: "ObjectWriter",
  }
});

const publicAccessBlock = new aws.s3.BucketPublicAccessBlock("publicAccessBlock", {
  bucket: staticWebBucket.id,
  blockPublicAcls: false,
});

const indexObject = new aws.s3.BucketObject("index.html", {
  bucket: staticWebBucket.id,
  source: new pulumi.asset.FileAsset("../packages/frontend/static/index.html"),
  contentType: "text/html",
  acl: "public-read",
}, { dependsOn: [publicAccessBlock, ownershipControls] });

const staticWebBucketEndpoint = pulumi.interpolate`http://${staticWebBucket.websiteEndpoint}`;


export { staticWebBucket, staticWebBucketEndpoint, indexObject };