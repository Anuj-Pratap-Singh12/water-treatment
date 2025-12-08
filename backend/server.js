// backend/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mlRoutes = require("./routes/mlRoutes");
const iotRoutes = require("./routes/iotRoutes");

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// IoT routes - GPT-powered water data generation
app.use("/api/iot", iotRoutes);

// ML routes
app.use("/api/ml", mlRoutes);

// start server
const PORT = 5001;

app.listen(PORT, () => {
  console.log(`🚀 Backend Server is running on http://localhost:${PORT}`);
});
