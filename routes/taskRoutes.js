const express = require("express");
const router = express.Router();
const Task = require("../models/Task");


router.post('/add', async (req, res) => {
  try {
    const { AssignedTo, Status, DueDate, Priority, Comments, Description, Image } = req.body;

    const newTask = new Task({
      AssignedTo,
      Status,
      DueDate,
      Priority,
      Comments,
      Description,
      Image 
    });

    await newTask.save();
    res.status(201).json({ message: 'Task saved successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error saving task', details: error.message });
  }
});


router.get("/all", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.send(tasks); 
  } catch (err) {
    res.status(500).send(err);
  }
});


router.get("/id/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).send("Not Found");
    res.send(task);
  } catch (error) {
    res.status(500).send(error);
  }
});


router.put("/update/:id", async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTask) return res.status(404).send("Invalid data");
    res.send(updatedTask);
  } catch (error) {
    res.status(500).send("Update failed");
  }
});


router.delete("/delete/:id", async (req, res) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).send("Not Found");
    res.send("Task deleted successfully");
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
