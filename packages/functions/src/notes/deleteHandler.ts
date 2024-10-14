import * as aws from "@pulumi/aws";

const main = async (event: any, _context: any) => {
};

const deleteNoteHandler = new aws.lambda.CallbackFunction("deleteNoteHandler", {
  callback: main,
});

export default deleteNoteHandler;