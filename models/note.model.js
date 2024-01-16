const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const NoteSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Provide a title"],
    },
    content: {
      type: String,
      required: [true, "Provide note content"]
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    readCount: {
        type: Number,
        default: 0
    }
  },
  {
    timestamps: true,
  }
);

const Note = mongoose.model("Note", NoteSchema);
module.exports = Note;
