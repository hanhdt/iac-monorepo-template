import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

// Create an S3 Bucket
const webBucket = new aws.s3.Bucket("notes-frontend", {
  website: {
    indexDocument: "index.html",
  },
});

const ownershipControls = new aws.s3.BucketOwnershipControls("ownershipControls", {
  bucket: webBucket.bucket,
  rule: {
    objectOwnership: "ObjectWriter",
  }
});

const publicAccessBlock = new aws.s3.BucketPublicAccessBlock("publicAccessBlock", {
  bucket: webBucket.id,
  blockPublicAcls: false,
});

const indexObject = new aws.s3.BucketObject("index.html", {
  bucket: webBucket.id,
  source: new pulumi.asset.FileAsset("../packages/frontend/static/index.html"),
  contentType: "text/html",
  acl: "public-read",
}, { dependsOn: [publicAccessBlock, ownershipControls] });

const webBucketEndpoint = pulumi.interpolate`http://${webBucket.websiteEndpoint}`;


export { webBucket, webBucketEndpoint, indexObject };