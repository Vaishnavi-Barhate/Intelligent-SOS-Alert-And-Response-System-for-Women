const { getIO } = require("../config/socket");

/**
 * Send new alert notification to nearby users
 */
exports.sendAlertNotification = (users, alert) => {
  const io = getIO();

  if (!users || users.length === 0) {
    console.log("No nearby users to notify.");
    return;
  }

  users.forEach((user) => {
    io.to(user._id.toString()).emit("NEW_ALERT", {
      alertId: alert._id,
      user: alert.user,
      location: alert.location,
      status: alert.status,
      createdAt: alert.createdAt,
    });
  });

  console.log(`🚨 Alert sent to ${users.length} nearby users`);
};

/**
 * Send alert status update (RESPONDED / RESOLVED)
 */
exports.sendAlertStatusUpdate = (alert, targetUsers = []) => {
  const io = getIO();

  const payload = {
    alertId: alert._id,
    status: alert.status,
    responders: alert.responders,
  };

  if (targetUsers.length > 0) {
    // Notify specific users only
    targetUsers.forEach((user) => {
      io.to(user._id.toString()).emit("ALERT_STATUS_UPDATE", payload);
    });
  } else {
    // Broadcast if no specific list
    io.emit("ALERT_STATUS_UPDATE", payload);
  }

  console.log("📢 Alert status update sent");
};

/**
 * Emit live location update of a user
 */
exports.sendLiveLocationUpdate = (userId, latitude, longitude) => {
  const io = getIO();

  io.emit("LIVE_LOCATION_UPDATE", {
    userId,
    latitude,
    longitude,
    timestamp: new Date(),
  });
};

/**
 * Notify responders that someone accepted the alert
 */
exports.notifyResponderJoined = (alertId, responderId) => {
  const io = getIO();

  io.emit("RESPONDER_JOINED", {
    alertId,
    responderId,
  });

  console.log(`👤 Responder ${responderId} joined alert ${alertId}`);
};
