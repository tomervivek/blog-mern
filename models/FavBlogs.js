const mongoose = require("mongoose");
const favBlogsSchema =new mongoose.Schema({
    BlogId:String,
    UserId: String,
    email: String,
    createdDate: {
      type: Date,
      default: Date.now,
    },
    updatedDate: {
      type: Date,
      default: Date.now,
    },
  });
  

module.exports = mongoose.model("Favblogs",favBlogsSchema);