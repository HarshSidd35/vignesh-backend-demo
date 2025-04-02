const mongoose = require("mongoose");

const LastUserSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fromDate: { type: Date, required: true },
  toDate: { type: Date, required: true }
});

const BookSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rent: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  lastUsers: [LastUserSchema],
  inStock: { type: Boolean, default: true },
  personHaveThatBook: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  count:{type:Number, default:1},
  cover: { type: String, required: true } // URL for the image
});

module.exports = mongoose.model("Book", BookSchema);
