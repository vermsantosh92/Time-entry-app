const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  taskName: { type: String, required: true },
  projectName: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime:  { type: String, required: true },
});

module.exports = mongoose.model("Post", postSchema);
