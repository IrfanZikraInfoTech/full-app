const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Assuming User is your Mongoose model
const Student = require("../models/Student"); // Student model
const Result = require("../models/Result"); // Result model

// Signup function
exports.signup = async (req, res) => {
  const { name, email, password, role, securityQuestion, securityAnswer } =
    req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // If the user exists, ask for security answer verification
      if (!req.body.securityAnswer || !securityQuestion) {
        return res.status(400).json({
          error:
            "User already exists. Please provide the security question and answer to replace the existing user.",
          securityQuestion: existingUser.securityQuestion, // Return the question to the frontend
        });
      }

      // Compare the security answer
      const isAnswerCorrect = await existingUser.compareSecurityAnswer(
        req.body.securityAnswer
      );

      if (!isAnswerCorrect) {
        return res.status(401).json({ error: "Incorrect security answer." });
      }

      // If the security answer matches, replace the user with the new details
      existingUser.name = name;
      existingUser.password = password; // Will be re-hashed due to the pre-save middleware
      existingUser.securityQuestion = securityQuestion;
      existingUser.securityAnswer = securityAnswer;
      existingUser.role = role || "user"; // Update role if provided

      await existingUser.save(); // Save the updated user
      return res.status(200).json({ message: "User replaced successfully." });
    }

    // If user doesn't exist, create a new user
    const user = new User({
      name,
      email,
      password,
      role: role || "user",
      securityQuestion,
      securityAnswer, // This will be hashed by the pre-save middleware
    });

    await user.save(); // Save the new user to MongoDB
    res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    console.error("Error during signup:", err); // Log the actual error
    res.status(400).json({ error: err.message || "Signup failed" });
  }
};

// Regular login function
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Log the request data
    console.log("Login attempt:", { email, password });

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

    // Check if JWT_SECRET is defined
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is not defined");
      return res.status(500).json({ error: "Internal server error" });
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
    console.error("Error during login:", err); // Log the actual error
    res.status(500).json({ error: "Server error", details: err.message });
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
        fathername: student.fathername,
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
