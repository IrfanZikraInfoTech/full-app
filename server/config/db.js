const mongoose = require("mongoose");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

// MongoDB connection string from environment variables
const mongoURI =
  process.env.MONGO_URI || "mongodb://localhost:27017/mydatabase"; // Default to localhost for development

// Function to connect to MongoDB
const connectDB = async () => {
  try {
    // Use Mongoose to connect to MongoDB
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB successfully.");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    process.exit(1); // Exit the process with failure
  }
};

// Export the connection function
module.exports = connectDB;
