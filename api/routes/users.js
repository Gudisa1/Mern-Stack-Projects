const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const verify = require("../verifyToken");
// Update

router.put("/:id", verify, async (req, res) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    if (req.body.password) {
      req.body.password = CryptoJS.AES.encrypt(
        req.body.password,
        process.env.SECRET_KEY
      ).toString();
    }

    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("You can update only your account!");
  }
});

// Delete

router.delete("/:id", verify, async (req, res) => {
  if (req.user.id === req.params.id || req.user.isAdmin) {
    try {
      // Remove the user from the database
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  } else {
    res.status(403).json("You can Delete only your account!");
  }
});

// Get one User
router.get("/find/:id", verify, async (req, res) => {
  try {
    //GET SINGLE USER
    const user = await User.findById(req.params.id);
    const { password, ...info } = user;
    res.status(200).json(info);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all user
router.get("/ ", verify, async (req, res) => {
  if (req.user.isAdmin) {
    try {
      const users = query ? await User.find().limit(10) : await User.find();

      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  } else {
    res.status(403).json("You are not allow to see all users");
  }
});

// Get user Stat
router.get("/stats", async (req, res) => {
  const today = new Date();
  const latYear = today.setFullYear(today.setFullYear() - 1);

  try {
    const data = await User.aggregate([
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
