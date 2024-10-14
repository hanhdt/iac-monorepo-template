import * as aws from "@pulumi/aws";
import * as pulumi from "@pulumi/pulumi";

// Create an S3 bucket to store notes
const uploadsBucket = new aws.s3.BucketV2("notes-bucket");

// Create DynamoDB table to store notes
const notesTable = new aws.dynamodb.Table("notes-table", {
  name: "notes",
  billingMode: "PROVISIONED",
  readCapacity: 5,
  writeCapacity: 5,
  hashKey: "userId",
  rangeKey: "noteId",
  attributes: [
    { name: "userId", type: "S" },
    { name: "noteId", type: "S" },
  ],
  tags: {
    Name: "notes-table",
    Environment: `${ pulumi.getStack() }`,
  },
}, { dependsOn: uploadsBucket });

export { uploadsBucket, notesTable };