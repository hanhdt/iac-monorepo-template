import * as aws from "@pulumi/aws";

const uploadsBucket = new aws.s3.BucketV2("notes-bucket");

export { uploadsBucket };