const mongoose = require("mongoose");

const blogsSchema = new mongoose.Schema({
    title: String,
    content: String,
    author: String,
    selectedImage: String,
    UserId: String,
    createdDate: {
      type: Date,
      default: Date.now,
    },
    updatedDate: {
      type: Date,
      default: Date.now,
    },
  });
  

module.exports = mongoose.model("Blogs", blogsSchema);
