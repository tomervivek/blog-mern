const mongoose = require("mongoose");

const UsersSchema = new mongoose.Schema({
  email: String,
  UserId: String,
  password: String,
  role: {
    type: String,
    enum: ["admin", "user"],
    default: "user",
  },
  name: String,
  isVerified: {
    type: Boolean,
    default: false,
  },
  otp: String,
  otpExpires: Date,
  createdDate: {
    type: Date,
    default: Date.now,
  },
  updatedDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", UsersSchema);
