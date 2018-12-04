const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    // document structure & rules defined here
    fullName: {
      type: String,
      required: true,
      minlength: 2
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^.+@.+\..+$/
    },
    avatar: { type: String },
    encryptedPassword: { type: String, required: true },
    role: {
      type: String,
      enum: ["normal", "admin"],
      required: true,
      default: "normal"
    }
  },
  {
    // additional settings for the Schema class
    timestamps: true
  }
);

// "User" model -> "users" collection
const User = mongoose.model("User", userSchema);

module.exports = User;
