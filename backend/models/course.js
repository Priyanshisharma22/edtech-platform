const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  videos: Array
});

module.exports = mongoose.model("Course", courseSchema);
