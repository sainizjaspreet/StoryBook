const express = require("express");
const router = express.Router();
const { ensureAuth, ensureGuest } = require("../middleware/auth");
const Story = require("../models/story");

//@desc   Login/landing page
//@route  GET /

router.get("/", ensureGuest, (req, res) => {
  res.render("login", {
    layout: "login",
  });
});

//@desc   DASHBOARD
// route get/dashboard
router.get("/dashboard", ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ user: req.user.id }).lean();
    res.render("dashboard", {
      name: req.user.username,
      stories,
    });
  } catch (err) {
    console.error(err);
    res.render("errors/500");
  }
});

module.exports = router;
