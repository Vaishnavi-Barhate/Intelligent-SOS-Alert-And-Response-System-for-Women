const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  secretWord: String,
  role: { type: String, default: "user" },

  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: [0, 0]
    }
  }
}, { timestamps: true });

userSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("User", userSchema);
