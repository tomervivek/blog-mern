// const express = require("express");
// const router = express.Router();
// const Blogs = require("../models/Blogs");
// const subscribers = require("../models/Subscribers");
// const Favblogs = require("../models/FavBlogs");
// const User = require("../models/Users");
// const crypto = require("crypto");
// const nodemailer = require("nodemailer");
// require("dotenv").config();
// router.post("/add-new-blog", async (req, res) => {
//   try {
//     const { title, content, author, selectedImage, UserId } = req.body;
//     const newBlog = new Blogs({
//       title,
//       content,
//       author,
//       selectedImage,
//       UserId,
//     });
//     // console.log(newBlog);
//     await newBlog.save();
//     res.status(201).json({ message: "Blog saved successfully" });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ error: "Error saving task", details: error.message });
//   }
// });

// router.get("/all-blogs", async (req, res) => {
//   try {
//     const blogs = await Blogs.find();
//     res.send(blogs);
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });
// router.get("/fav-blogs", async (req, res) => {
//   try {
//     const { email } = req.query;

//     if (!email) {
//       return res.status(400).json({ error: "Email is required to fetch favorites" });
//     }

//     const favBlogs = await Favblogs.find({ email });

//     res.status(200).json(favBlogs);
//   } catch (err) {
//     res.status(500).json({ error: "Error fetching favorite blogs", details: err.message });
//   }
// });

// router.get("/:id", async (req, res) => {
//   try {
//     const blog = await Blogs.findById(req.params.id);
//     if (!blog) return res.status(404).send("Not Found");
//     res.send(blog);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// router.post("/subscribe", async (req, res) => {
//   try {
//     const { email, UserId } = req.body;
//     const subs = new subscribers({
//       email,
//       UserId,
//     });
//     // console.log(subs);
//     await subs.save();
//     res.status(201).json({ message: "Subscribed successfully" });
//   } catch (error) {
//     res.status(500).json({ error: "Error", details: error.message });
//   }
// });

// router.post("/add-fav", async (req, res) => {
//   try {
//     const { BlogId, email, UserId } = req.body;

//     const existingFav = await Favblogs.findOne({ BlogId, email });

//     if (existingFav) {
//       await Favblogs.deleteOne({ BlogId, email });
//       return res.status(200).json({ message: "Removed from favorites" });
//     } else {
//       const fav = new Favblogs({ BlogId, email, UserId });
//       await fav.save();
//       return res.status(201).json({ message: "Added to favorites" });
//     }
//   } catch (error) {
//     res.status(500).json({ error: "Error", details: error.message });
//   }
// });


// /* --------------------------User management-------------------------- */

// const generateOTP = () => crypto.randomInt(100000, 999999).toString();

// const sendEmail = async (email, otp) => {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASS,
//     },
//   });

//   await transporter.sendMail({
//     from: "MindSpring httptechscript@gmail.com",
//     to: email,
//     subject: "Verify Your Account",
//     text: `Your OTP is: ${otp}`,
//   });
// };

// router.post("/signup", async (req, res) => {
//   try {
//     const { email, password, name } = req.body;

//     const existingUser = await User.findOne({ email });

//     if (existingUser) {
//       if (existingUser.isVerified) {
//         return res
//           .status(400)
//           .json({ message: "User already exists and is verified" });
//       } else {
//         const otp = generateOTP();
//         existingUser.otp = otp;
//         existingUser.otpExpires = Date.now() + 10 * 60 * 1000;
//         await existingUser.save();
//         await sendEmail(email, otp);

//         return res.status(200).json({
//           message: "User exists but not verified. OTP resent to email.",
//         });
//       }
//     }

//     // Create new user if not exists
//     const otp = generateOTP();
//     const newUser = new User({
//       email,
//       password,
//       name,
//       UserId: crypto.randomUUID(),
//       otp,
//       otpExpires: Date.now() + 10 * 60 * 1000,
//     });

//     await newUser.save();
//     await sendEmail(email, otp);

//     res
//       .status(201)
//       .json({ message: "Signup successful. OTP sent to your email." });
//   } catch (err) {
//     res.status(500).json({ error: "Server error" });
//   }
// });

// router.post("/verify-otp", async (req, res) => {
//   const { email, otp } = req.body;

//   const user = await User.findOne({ email });

//   if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
//     return res.status(400).json({ message: "Invalid or expired OTP" });
//   }

//   user.isVerified = true;
//   user.otp = null;
//   user.otpExpires = null;
//   await user.save();

//   res.json({ message: "Account verified successfully!" });
// });

// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (user && user.isVerified && user.password === password) {
//       return res.status(200).json({ message: "Login successful", user });
//     }
//     if (!user || !user.isVerified) {
//       return res
//         .status(400)
//         .json({ message: "User not found, create an account" });
//     } else if (user.password !== password) {
//       return res.status(400).json({ message: "Invalid password" });
//     }
//   } catch (err) {
//     res.status(500).json({ error: "Server error" });
//   }
// });

// module.exports = router;




const express = require("express");
const router = express.Router();
const Blogs = require("../models/Blogs");
const subscribers = require("../models/Subscribers");
const Favblogs = require("../models/FavBlogs");
const User = require("../models/Users");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const authenticateToken = require("../middleware/auth");

require("dotenv").config();
const JWT_SECRET = "ask8F!sdf8@#sdf9sdf8sdf7sdf"

// ---------- Blog Routes ----------

// 🔒 Protected
router.post("/add-new-blog", authenticateToken, async (req, res) => {
  
  try {
    const { title, content, author, selectedImage } = req.body;
    const UserId = req.user.UserId;

    const newBlog = new Blogs({
      title,
      content,
      author,
      selectedImage,
      UserId,
    });

    await newBlog.save();
    res.status(201).json({ message: "Blog saved successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error saving blog", details: error.message });
  }
});

// 🆓 Public
router.get("/all-blogs", async (req, res) => {
  try {
    const blogs = await Blogs.find();
    res.send(blogs);
  } catch (err) {
    res.status(500).send(err);
  }
});

// 🔒 Protected
router.get("/fav-blogs", authenticateToken, async (req, res) => {
  try {
    const { email } = req.user;
    const favBlogs = await Favblogs.find({ email });
    res.status(200).json(favBlogs);
  } catch (err) {
    res.status(500).json({ error: "Error fetching favorites", details: err.message });
  }
});

// 🆓 Public
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blogs.findById(req.params.id);
    if (!blog) return res.status(404).send("Not Found");
    res.send(blog);
  } catch (error) {
    res.status(500).send(error);
  }
});

// 🔒 Protected
router.post("/subscribe", authenticateToken, async (req, res) => {
  try {
    const { email, UserId } = req.user;
    const subs = new subscribers({ email, UserId });
    await subs.save();
    res.status(201).json({ message: "Subscribed successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error subscribing", details: error.message });
  }
});

// 🔒 Protected
router.post("/add-fav", authenticateToken, async (req, res) => {
  try {
    const { BlogId } = req.body;
    const { email, UserId } = req.user;

    const existingFav = await Favblogs.findOne({ BlogId, email });

    if (existingFav) {
      await Favblogs.deleteOne({ BlogId, email });
      return res.status(200).json({ message: "Removed from favorites" });
    } else {
      const fav = new Favblogs({ BlogId, email, UserId });
      await fav.save();
      return res.status(201).json({ message: "Added to favorites" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error updating favorite", details: error.message });
  }
});


// ---------- User Management ----------

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
    from: "MindSpring httptechscript@gmail.com",
    to: email,
    subject: "Verify Your Account",
    text: `Your OTP is: ${otp}`,
  });
};

router.post("/signup", async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.isVerified) {
        return res
          .status(400)
          .json({ message: "User already exists and is verified" });
      } else {
        const otp = generateOTP();
        existingUser.otp = otp;
        existingUser.otpExpires = Date.now() + 10 * 60 * 1000;
        await existingUser.save();
        await sendEmail(email, otp);

        return res.status(200).json({
          message: "User exists but not verified. OTP resent to email.",
        });
      }
    }

    const otp = generateOTP();
    const newUser = new User({
      email,
      password,
      name,
      UserId: crypto.randomUUID(),
      otp,
      otpExpires: Date.now() + 10 * 60 * 1000,
    });

    await newUser.save();
    await sendEmail(email, otp);

    res
      .status(201)
      .json({ message: "Signup successful. OTP sent to your email." });
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

  // Optional: Issue token upon verification
  const token = jwt.sign({ email: user.email, UserId: user.UserId }, JWT_SECRET, { expiresIn: "1h" });

  res.json({ message: "Account verified successfully!", token });
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && user.isVerified && user.password === password) {
      const token = jwt.sign({ email, UserId: user.UserId }, JWT_SECRET, { expiresIn: '1h' });

      return res.status(200).json({ message: "Login successful", token, user });
    }

    if (!user || !user.isVerified) {
      return res
        .status(400)
        .json({ message: "User not found or not verified" });
    } else if (user.password !== password) {
      return res.status(400).json({ message: "Invalid password" });
    }
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
