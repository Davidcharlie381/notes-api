const NoteController = require("../controllers/note.controller");
const router = require("express").Router();

router.get("/", NoteController.getNotes);

router
  .route("/:id")
  .get(NoteController.getSingleNote)
  .post(NoteController.createNote)
  .put(NoteController.updateNote)
  .delete(NoteController.deleteNote);

module.exports = router;
