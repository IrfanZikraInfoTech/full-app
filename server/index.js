const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const resultRoutes = require("./routes/resultRoutes");
const dotenv = require("dotenv");
const connectDB = require('./config/db'); // Import the connection function

dotenv.config();
const app = express();

app.use(
  cors({
    origin: "https://full-app-2jrg.vercel.app", // Your React frontend
    credentials: true, // This allows credentials like cookies to be sent with the request
  })
);
app.use(bodyParser.json());
connectDB();

// Routes
app.use("/api", authRoutes);
app.use("/api", studentRoutes);
app.use("/api", resultRoutes); // Use the result routes
app.use("/auth", authRoutes);
app.get("/", (req, res) => {
  res.send("Hello from Vercel!");
});

// // Server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
module.exports = app;
