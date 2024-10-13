import * as aws from "@pulumi/aws";

// Create an AWS resource (S3 Bucket)
export const bucket = new aws.s3.BucketV2("notes-bucket");