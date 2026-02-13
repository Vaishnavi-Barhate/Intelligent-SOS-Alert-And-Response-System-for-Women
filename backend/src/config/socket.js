const socketIO = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

let io;

const initSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error("Authentication error: No token"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id);
      if (!user) {
        return next(new Error("Authentication error: User not found"));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    const userId = socket.user._id.toString();

    // Join user-specific room
    socket.join(userId);
    console.log(`User ${userId} joined room`);

    socket.on("UPDATE_LOCATION", async (data) => {
      console.log(" Location update from:", userId, data);

      io.emit("LIVE_LOCATION_UPDATE", {
        userId,
        latitude: data.latitude,
        longitude: data.longitude,
      });
    });

    socket.on("disconnect", () => {
      console.log(" Socket disconnected:", socket.id);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

module.exports = { initSocket, getIO };
