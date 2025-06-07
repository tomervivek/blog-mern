const express = require("express");
const router = express.Router();
const Blogs = require("../models/Blogs");
const subscribers = require("../models/Subscribers");
const Favblogs = require("../models/FavBlogs");
const User = require("../models/Users");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
require('dotenv').config();
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


/* --------------------------User management-------------------------- */

const generateOTP = () => crypto.randomInt(100000, 999999).toString();

const sendEmail = async (email, otp) => {
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


  await transporter.sendMail({
    from: 'MindSpring httptechscript@gmail.com',
    to: email,
    subject: "Verify Your Account",
    text: `Your OTP is: ${otp}`,
  });
};

router.post("/signup", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const otp = generateOTP();

    const user = new User({
      email,
      password,
      name,
      UserId: crypto.randomUUID(), // or use any random ID generator
      otp,
      otpExpires: Date.now() + 10 * 60 * 1000, // 10 minutes
    });

    await user.save();
    await sendEmail(email, otp);

    res.json({ message: "Signup successful. OTP sent to your email." });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });

  if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  user.isVerified = true;
  user.otp = null;
  user.otpExpires = null;
  await user.save();

  res.json({ message: "Account verified successfully!" });
});


module.exports = router;