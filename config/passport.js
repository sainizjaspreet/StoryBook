const GithubStrategy = require("passport-github2").Strategy;
const mongoose = require("mongoose");
const User = require("../models/users");

module.exports = function (passport) {
  passport.use(
    new GithubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "https://storybook-g850.onrender.com/auth/github/callback",
        proxy: true,
      },
      async (accessToken, refreshToken, profile, done) => {
        const newUser = {
          githubId: profile.username,
          image: profile.photos[0].value,
        };
        try {
          let user = await User.findOne({ githubId: profile.username });
          if (user) {
            done(null, user);
          } else {
            user = await User.create(newUser);
            done(null, user);
          }
        } catch (err) {
          console.error(err);
        }
      }
    )
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
