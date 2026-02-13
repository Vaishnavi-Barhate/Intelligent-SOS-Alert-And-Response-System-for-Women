const Alert = require("../models/Alert");
const User = require("../models/User");
const { findNearbyUsers } = require("../services/geolocationService");
const {
  sendAlertNotification,
  sendAlertStatusUpdate,
  notifyResponderJoined,
} = require("../services/notificationService");

/**
 * 🔴 Trigger SOS Alert
 */
exports.triggerAlert = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: "Location is required" });
    }

    // Create alert
    const alert = await Alert.create({
      user: req.user._id,
      location: {
        type: "Point",
        coordinates: [longitude, latitude], // IMPORTANT: [lng, lat]
      },
      status: "ACTIVE",
    });

    // Find nearby users (within 5km)
    const nearbyUsers = await findNearbyUsers(
      longitude,
      latitude,
      5000
    );

    // Remove the victim from notification list
    const filteredUsers = nearbyUsers.filter(
      (user) => user._id.toString() !== req.user._id.toString()
    );

    // Send real-time notification
    sendAlertNotification(filteredUsers, alert);

    res.status(201).json(alert);
  } catch (error) {
    console.error("Trigger Alert Error:", error.message);
    res.status(500).json({ message: "Failed to trigger alert" });
  }
};

/**
 * 📍 Fetch Nearby Active Alerts
 */
exports.fetchNearbyAlerts = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ message: "Location query required" });
    }

    const alerts = await Alert.find({
      status: "ACTIVE",
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [
              parseFloat(longitude),
              parseFloat(latitude),
            ],
          },
          $maxDistance: 5000,
        },
      },
    }).populate("user", "name email");

    res.json(alerts);
  } catch (error) {
    console.error("Fetch Alerts Error:", error.message);
    res.status(500).json({ message: "Failed to fetch alerts" });
  }
};

/**
 * 👤 Mark Attendance (Responder accepts alert)
 */
exports.markAttendance = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({ message: "Alert not found" });
    }

    if (!alert.responders.includes(req.user._id)) {
      alert.responders.push(req.user._id);
    }

    alert.status = "RESPONDED";
    await alert.save();

    // Notify others
    sendAlertStatusUpdate(alert);
    notifyResponderJoined(alert._id, req.user._id);

    res.json(alert);
  } catch (error) {
    console.error("Mark Attendance Error:", error.message);
    res.status(500).json({ message: "Failed to mark attendance" });
  }
};

/**
 * ✅ Resolve Alert
 */
exports.resolveAlert = async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.id);

    if (!alert) {
      return res.status(404).json({ message: "Alert not found" });
    }

    alert.status = "RESOLVED";
    await alert.save();

    sendAlertStatusUpdate(alert);

    res.json(alert);
  } catch (error) {
    console.error("Resolve Alert Error:", error.message);
    res.status(500).json({ message: "Failed to resolve alert" });
  }
};
