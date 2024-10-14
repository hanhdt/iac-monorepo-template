import createNoteHandler from "./createHandler";
import updateNoteHandler from "./updateHandler";
import deleteNoteHandler from "./deleteHandler";

export namespace Notes {
  export const createHandler = createNoteHandler;
  export const updateHandler = updateNoteHandler;
  export const deleteHandler = deleteNoteHandler;
}