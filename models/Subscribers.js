const mongoose = require("mongoose");

const SubscribersSchema =new mongoose.Schema({
    email:String,
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
  

module.exports = mongoose.model("subscribers",SubscribersSchema);