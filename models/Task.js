const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  AssignedTo: String,
  Status: String,
  DueDate: Date,
  Priority: String,
  Comments: String,
  Description: String,
  Image: String,
});

module.exports = mongoose.model("Task", taskSchema);
