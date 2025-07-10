const express = require("express");
const router = express.Router();
const passport = require("passport");

//@desc   AUTH with Github
//@route  GET /auth/github

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

//@desc   github auth callback
// route GET /auth/github/callback
router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);
//@desc  Logout User
//@route  /auth/logout
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});
module.exports = router;
