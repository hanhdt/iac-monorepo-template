import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

// Create an S3 Bucket
const introWebBucket = new aws.s3.Bucket("notes-frontend", {
  website: {
    indexDocument: "index.html",
  },
});

const ownershipControls = new aws.s3.BucketOwnershipControls("ownershipControls", {
  bucket: introWebBucket.bucket,
  rule: {
    objectOwnership: "ObjectWriter",
  }
});

const publicAccessBlock = new aws.s3.BucketPublicAccessBlock("publicAccessBlock", {
  bucket: introWebBucket.id,
  blockPublicAcls: false,
});

const indexObject = new aws.s3.BucketObject("index.html", {
  bucket: introWebBucket.id,
  source: new pulumi.asset.FileAsset("../packages/frontend/static/index.html"),
  contentType: "text/html",
  acl: "public-read",
}, { dependsOn: [publicAccessBlock, ownershipControls] });

const introWebBucketEndpoint = pulumi.interpolate`http://${introWebBucket.websiteEndpoint}`;


export { introWebBucket, introWebBucketEndpoint, indexObject };