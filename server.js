const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");
const blogsRoutes = require("./routes/blogsRouts");
const app = express();
const PORT = 8000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Connect to DB
connectDB();

// Routes
app.use("/tasks", taskRoutes);
app.use("/blogs", blogsRoutes);


// Server Start
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
