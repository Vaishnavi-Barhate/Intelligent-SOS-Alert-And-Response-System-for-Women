require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");

const connectDB = require("./config/db");
const { initSocket } = require("./config/socket");

const authRoutes = require("./routes/authRoutes");
const alertRoutes = require("./routes/alertRoutes");
const userRoutes = require("./routes/userRoutes");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/users", userRoutes);

const server = http.createServer(app);

initSocket(server);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
