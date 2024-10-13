import * as aws from "@pulumi/aws";

// Create an S3 Bucket
const bucket = new aws.s3.BucketV2("notes-bucket");

// Create an AWS resource (S3 Bucket)
export { bucket };