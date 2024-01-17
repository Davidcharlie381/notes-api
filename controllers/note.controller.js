const Note = require("../models/note.model");

class NoteController {
  static async getNotes(req, res) {
    try {
      const notes = await Note.find();
      res.status(200).json({ success: true, data: notes });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: err.message });
    }
  }
  static async getSingleNote(req, res) {
    const { id } = req.params;
    try {
      const note = await Note.findById(id);
      if (!note) {
        return res
          .status(404)
          .json({ success: false, error: `Note with id ${id} not found` });
      }
      res.status(200).json({ success: true, data: note });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: err.message });
    }
  }
  static async createNote(req, res) {
    const { title, content } = req.body;
    try {
      if (!(title && content)) {
        return res.status(400).json({
          success: false,
          error: "One or more required fields is missing",
        });
      }
      const newNote = await Note.create({
        title,
        content,
        user: req.user._id,
      });

      res.status(201).json({ success: true, data: newNote });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async updateNote(req, res) {
    const { title, content } = req.body;
    const { id } = req.params;
    try {
      const note = await Note.findByIdAndUpdate(
        id,
        { title, content },
        { new: true }
      );
      if (!note) {
        return res
          .status(404)
          .json({ success: false, error: `Note with id ${id} not found` });
      }
      res.status(201).json({
        success: true,
        data: note,
        message: "Note updated successfully",
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async deleteNote(req, res) {
    const { id } = req.params;
    try {
      const note = await Note.findByIdAndDelete(id);
      if (!note) {
        return res
          .status(404)
          .json({ success: false, error: `Note with id ${id} not found` });
      }
      res.status(201).json({
        success: true,
        message: "Note deleted successfully",
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: err.message });
    }
  }

  static async deleteAllNotes(req, res) {
    try {
      const result = await Note.deleteMany();
      if (!result.acknowledged) {
        return res
          .status(400)
          .json({ success: false, error: "No notes to delete" });
      }
      res.status(200).json({
        success: true,
        message: `Deleted ${result.deletedCount} ${
          result.deletedCount > 1 ? "notes" : "note"
        }`,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, error: err.message });
    }
  }
}

module.exports = NoteController;
