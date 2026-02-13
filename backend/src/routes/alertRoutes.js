const express = require("express");
const {
  triggerAlert,
  fetchNearbyAlerts,
  resolveAlert,
  markAttendance
} = require("../controllers/alertController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/trigger", protect, triggerAlert);
router.get("/nearby", protect, fetchNearbyAlerts);
router.put("/resolve/:id", protect, resolveAlert);
router.put("/respond/:id", protect, markAttendance);

module.exports = router;
