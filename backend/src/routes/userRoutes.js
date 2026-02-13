const express = require("express");
const {
  getProfile,
  updateSecretWord,
  updateLocation
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/profile", protect, getProfile);
router.put("/secret-word", protect, updateSecretWord);
router.put("/location", protect, updateLocation);

module.exports = router;
