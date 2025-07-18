const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  githubId: {
    type: String,
    required: true,
  },

  image: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", UserSchema);
