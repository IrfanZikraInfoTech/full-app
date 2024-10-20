  const mongoose = require("mongoose");
  const bcrypt = require("bcryptjs");

  // Define the user schema
  const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" },
    securityQuestion: { type: String, required: true }, // Add security question field
    securityAnswer: { type: String, required: true }, // Add security answer field (will be hashed)
  });

  // Method to hash password and security answer before saving the user
  userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }

    if (this.isModified("securityAnswer")) {
      const salt = await bcrypt.genSalt(10);
      this.securityAnswer = await bcrypt.hash(this.securityAnswer, salt); // Hash the security answer
    }

    next();
  });

  // Method to compare the security answer for user replacement
  userSchema.methods.compareSecurityAnswer = async function (inputAnswer) {
    return await bcrypt.compare(inputAnswer, this.securityAnswer);
  };

  const User = mongoose.model("User", userSchema);
  module.exports = User;
