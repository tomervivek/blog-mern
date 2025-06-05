const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://mernapp:lqbOUDOlMx3YdRbs@cluster0.apzhxhy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("DB connection error:", error);
    process.exit(1); // Exit process if DB fails
  }
};

module.exports = connectDB;
