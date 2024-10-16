import createNoteHandler from "./createHandler";
import updateNoteHandler from "./updateHandler";
import deleteNoteHandler from "./deleteHandler";
import getNoteHandler from "./getHandler";
import listNotesHandler from "./listHandler";

export namespace NoteHandlers {
  export const createHandler = createNoteHandler;
  export const updateHandler = updateNoteHandler;
  export const deleteHandler = deleteNoteHandler;
  export const getHandler = getNoteHandler;
  export const listHandler = listNotesHandler;
}