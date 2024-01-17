const NoteController = require("../controllers/note.controller");
const AuthMiddleware = require("../middleware/auth");
const router = require("express").Router();

router
  .route("/")
  .get(AuthMiddleware.isAuth, AuthMiddleware.isAdmin, NoteController.getNotes)
  .post(AuthMiddleware.isAuth, NoteController.createNote)
  .delete(AuthMiddleware.isAuth, AuthMiddleware.isAdmin, NoteController);

router
  .route("/:id")
  .get(NoteController.getSingleNote)
  .put(NoteController.updateNote)
  .delete(NoteController.deleteNote);

module.exports = router;
