const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Assuming User is your Mongoose model
const Student = require("../models/Student"); // Student model
const Result = require("../models/Result"); // Result model

// Signup function
exports.signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Create a new user
    const user = new User({ name, email, password, role: role || "user" });

    // Save the user to MongoDB
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Error during signup:", err); // Log the actual error
    res.status(400).json({ error: err.message || "Signup failed" });
  }
};

// Regular login function
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Email or password is incorrect" });
    }

    // Compare the provided password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Email or password is incorrect" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Respond with the JWT token
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Logout function
exports.logout = (req, res) => {
  return res.status(200).json({ message: "Successfully logged out" });
};

// Authenticate via email and registration number
exports.loginForResult = async (req, res) => {
  const { email, registration_number } = req.body;

  try {
    console.log("Email:", email, "Registration Number:", registration_number);

    // Find the student by email and registration number
    const student = await Student.findOne({
      email: email.toLowerCase(),
      registration_number: registration_number,
    });

    if (!student) {
      return res
        .status(404)
        .json({ error: "Invalid email or registration number" });
    }

    // Fetch the result for the student
    const result = await Result.findOne({ student_id: student._id });

    if (!result) {
      return res
        .status(404)
        .json({ message: "No results found for this student" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: student._id,
        email: student.email,
        registrationNumber: student.registration_number,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Return the token, student, and result
    res.status(200).json({
      token,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        registrationNumber: student.registration_number,
      },
      result: {
        courseName: result.course_name,
        resultYear: result.result_year,
        marks: JSON.parse(result.result), // Assuming 'result' is stored as JSON string
      },
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
