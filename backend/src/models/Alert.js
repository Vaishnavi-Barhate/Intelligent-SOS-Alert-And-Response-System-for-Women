const mongoose = require("mongoose");

const alertSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: [Number]
  },

  status: {
    type: String,
    enum: ["ACTIVE", "RESPONDED", "RESOLVED"],
    default: "ACTIVE"
  },

  responders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }]

}, { timestamps: true });

alertSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Alert", alertSchema);
