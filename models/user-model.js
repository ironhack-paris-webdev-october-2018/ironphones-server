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
    avatar: {
      type: String
    },
    encryptedPassword: { type: String },
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

// define the "isAdmin" virtual property (it's really like a method)
// CAN'T be an arrow functions because it uses THIS
// (we use thise to get around the limits on if conditions in HBS files)
userSchema.virtual("isAdmin").get(function() {
  return this.role === "admin";
});

// "User" model -> "users" collection
const User = mongoose.model("User", userSchema);

module.exports = User;
