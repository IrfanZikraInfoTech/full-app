const pool = require("../config/db");

// Get all students
exports.getStudents = async (req, res) => {
  try {
    const [students] = await pool.query("SELECT * FROM students");
    res.send(students);
  } catch (err) {
    res.status(400).send(err);
  }
};

// Add a student
exports.addStudent = async (req, res) => {
  const { name, email, registrationNumber, addharnumber } = req.body; // This matches the frontend

  try {
    const result = await pool.query(
      "INSERT INTO students (name, email, registration_number, aadhar_number) VALUES (?, ?, ?, ?)",
      [name, email, registrationNumber, addharnumber] // Pass 'addharnumber'
    );
    res.send("Student added");
  } catch (err) {
    console.error("Error adding student:", err); // Log the error for more details
    res.status(400).send("Bad Request: Invalid input data.");
  }
};

// Delete a student by ID
exports.deleteStudent = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query("DELETE FROM students WHERE id = ?", [id]);

    if (result[0].affectedRows === 0) {
      return res.status(404).send("Student not found");
    }

    res.send(`Student with ID ${id} deleted`);
  } catch (err) {
    res.status(400).send(err);
  }
};

// Get student and their results by registration number
exports.getStudentByRegistrationNumber = async (req, res) => {
  const registrationNumber = req.params.registrationNumber;
  console.log("Registration Number:", registrationNumber);

  try {
    // Query the student by registration number
    const [studentRows] = await pool.query(
      "SELECT * FROM students WHERE registration_number = ?",
      [registrationNumber]
    );

    if (studentRows.length === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    const student = studentRows[0];

    // Query the results for the student
    const [resultRows] = await pool.query(
      "SELECT * FROM results WHERE student_id = ?",
      [student.id]
    );

    if (resultRows.length === 0) {
      return res
        .status(404)
        .json({ message: "Results not found for this student" });
    }

    const result = resultRows[0];

    res.status(200).json({
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
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get results for the logged-in student (based on their JWT token)
exports.getResultsByStudentId = async (req, res) => {
  try {
    const student_id = req.user.id; // Extract the student ID from the decoded JWT token (from auth middleware)

    // Query to fetch the student's results
    const [results] = await pool.query(
      "SELECT * FROM results WHERE student_id = ?",
      [student_id]
    );

    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "No results found for this student" });
    }

    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ message: "Server error", details: err.message });
  }
};
