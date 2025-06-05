const express = require("express");
const router = express.Router();
const Blogs = require("../models/Blogs");
const subscribers = require("../models/Subscribers");
const Favblogs = require("../models/FavBlogs");

router.post("/add-new-blog", async (req, res) => {
  try {
    const { title, content, author, selectedImage, UserId } = req.body;
    const newBlog = new Blogs({
      title,
      content,
      author,
      selectedImage,
      UserId,
    });
    // console.log(newBlog);
    await newBlog.save();
    res.status(201).json({ message: "Blog saved successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error saving task", details: error.message });
  }
});

router.get("/all-blogs", async (req, res) => {
  try {
    const blogs = await Blogs.find();
    res.send(blogs); 
  } catch (err) {
    res.status(500).send(err);
  }
});
router.get("/fav-blogs", async (req, res) => {
  try {
    console.log("favBlogs",res);
    const favBlogs = await Favblogs.find();
    res.send(favBlogs); 
  } catch (err) {
    console.log("favBlogs",err);
    res.status(500).send(err);
  }
});
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blogs.findById(req.params.id);
    if (!blog) return res.status(404).send("Not Found");
    res.send(blog);
  } catch (error) {
    res.status(500).send(error);
  }
});


router.post("/subscribe", async (req, res) => {
  try {
    const { email, UserId } = req.body;
    const subs = new subscribers({
      email,
      UserId,
    });
    // console.log(subs);
    await subs.save();
    res.status(201).json({ message: "Subscribed successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error", details: error.message });
  }
});

router.post("/add-fav", async (req, res) => {
  try {
    const { BlogId } = req.body;

    const existingFav = await Favblogs.findOne({ BlogId });

    if (existingFav) {
      await Favblogs.deleteOne({ BlogId });
      return res.status(200).json({ message: "Removed from favorites" });
    } else {
      const fav = new Favblogs({ BlogId });
      await fav.save();
      return res.status(201).json({ message: "Added to favorites" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error", details: error.message });
  }
});



module.exports = router;