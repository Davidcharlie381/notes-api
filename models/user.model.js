const mongoose = require("mongoose");
const validator = require("validator");

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Provide an email"],
      unique: [true, "This email is already being used"],
      validate: [validator.isEmail, "Enter a valid email"],
    },
    password: {
      type: String,
      required: [true, "Must provide a password"],
    },
    username: {
      type: String,
      unique: [true, "Username already assigned"],
      sparse: true,
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    notes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Note",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
