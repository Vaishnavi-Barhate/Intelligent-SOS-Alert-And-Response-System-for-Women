const User = require("../models/User");
const { hashPassword, comparePassword, generateToken } = require("../utils/helpers");

exports.register = async (req, res) => {
  const { name, email, password, secretWord } = req.body;

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: "User exists" });

  const hashed = await hashPassword(password);

  const user = await User.create({
    name,
    email,
    password: hashed,
    secretWord
  });

  res.status(201).json({
    token: generateToken(user._id)
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const match = await comparePassword(password, user.password);
  if (!match) return res.status(400).json({ message: "Invalid credentials" });

  res.json({
    token: generateToken(user._id)
  });
};
