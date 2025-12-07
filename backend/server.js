// backend/server.js
const express = require("express");
const cors = require("cors");
const mlRoutes = require("./routes/mlRoutes"); // 👈 This now returns a router function

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

// ML routes
app.use("/api/ml", mlRoutes); // 👈 This expects a function, now it's correct

// start server
const PORT = 5001;

app.listen(PORT, () => {
  console.log(`🚀 Backend Server is running on http://localhost:${PORT}`);
});
