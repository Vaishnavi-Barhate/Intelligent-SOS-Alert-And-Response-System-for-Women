const User = require("../models/User");

// Get logged-in user profile
exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
};

// Update secret word
exports.updateSecretWord = async (req, res) => {
  const { secretWord } = req.body;

  if (!secretWord) {
    return res.status(400).json({ message: "Secret word is required" });
  }

  const user = await User.findById(req.user._id);
  user.secretWord = secretWord;

  await user.save();

  res.json({ message: "Secret word updated successfully" });
};

// Update user live location
const { getIO } = require("../config/socket");

exports.updateLocation = async (req, res) => {
  const { latitude, longitude } = req.body;

  const user = await User.findById(req.user._id);

  user.location = {
    type: "Point",
    coordinates: [longitude, latitude]
  };

  await user.save();

  // Emit live location update
  const io = getIO();
  io.emit("LIVE_LOCATION_UPDATE", {
    userId: user._id,
    latitude,
    longitude
  });

  res.json({ message: "Location updated" });
};


