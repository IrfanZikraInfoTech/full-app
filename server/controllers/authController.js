const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db"); // Assuming you're using pool.promise()

// Signup function (unchanged)
exports.signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    // Hash the password
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Insert the new user into the database
    await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role || "user"]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Error during signup:", err); // Log the actual error
    res.status(400).json({ error: err.message || "Signup failed" });
  }
};

// Regular login function (unchanged)
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Query to check if the email exists
    const [results] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    if (results.length === 0) {
      return res.status(400).json({ error: "Email or password is incorrect" });
    }

    const user = results[0];

    // Check if the password is valid
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Email or password is incorrect" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Respond with the JWT token
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).send({ error: "Server error" });
  }
};

// Logout function (unchanged)
exports.logout = (req, res) => {
  return res.status(200).json({ message: "Successfully logged out" });
};

// New function to authenticate via email and registration number
exports.loginForResult = async (req, res) => {
  const { email, registration_number } = req.body;

  try {
    console.log("Email:", email, "Registration Number:", registration_number);

    // Query to fetch the student using email and registration number
    const [results] = await pool.query(
      "SELECT * FROM students WHERE LOWER(email) = LOWER(?) AND registration_number = ?",
      [email, registration_number]
    );

    if (results.length === 0) {
      return res
        .status(404)
        .json({ error: "Invalid email or registration number" });
    }

    const student = results[0];

    // Query to fetch the results for the student
    const [resultRows] = await pool.query(
      "SELECT * FROM results WHERE student_id = ?",
      [student.id]
    );

    if (resultRows.length === 0) {
      return res
        .status(404)
        .json({ message: "No results found for this student" });
    }

    const result = resultRows[0];

    // Generate JWT token
    const token = jwt.sign(
      {
        id: student.id,
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
        id: student.id,
        name: student.name,
        email: student.email,
        registrationNumber: student.registration_number,
      },
      result: {
        courseName: result.course_name,
        resultYear: result.result_year,
        marks: JSON.parse(result.result), // assuming 'result' is stored as JSON
      },
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
