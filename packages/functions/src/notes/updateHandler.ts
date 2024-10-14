import * as aws from "@pulumi/aws";

const main = async (event: any, _context: any) => {
};

const updateNoteHandler = new aws.lambda.CallbackFunction("updateNoteHandler", {
  callback: main,
});

export default updateNoteHandler;