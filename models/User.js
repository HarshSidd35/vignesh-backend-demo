const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Name is required"] },
  email: { type: String, required: [true, "Email is required"], unique: true },
  isAdmin: { type: Boolean, default: false },
  rentedBooks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }],
  password: { type: String, required: [true, "Password is required"] }
});

module.exports = mongoose.model("User", UserSchema);