const Student = require("../models/Student");
const Result = require("../models/Result");

exports.getStudents = async (req, res) => {
  try {
    const students = await Student.find(); // Fetch all students
    res.status(200).json(students);
  } catch (err) {
    res
      .status(400)
      .json({ error: "Failed to fetch students", details: err.message });
  }
};

// Add a student
exports.addStudent = async (req, res) => {
  const { name, email, registrationNumber, aadharNumber } = req.body;

  try {
    const newStudent = new Student({
      name,
      email,
      registration_number: registrationNumber,
      aadhar_number: aadharNumber,
    });

    await newStudent.save(); // Save student to MongoDB
    res.status(201).json({ message: "Student added successfully" });
  } catch (err) {
    console.error("Error adding student:", err);
    res
      .status(400)
      .json({ error: "Bad Request: Invalid input data", details: err.message });
  }
};

// Delete a student by ID
exports.deleteStudent = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Student.findByIdAndDelete(id); // Find and delete student by ID

    if (!result) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({ message: `Student with ID ${id} deleted` });
  } catch (err) {
    res
      .status(400)
      .json({ error: "Failed to delete student", details: err.message });
  }
};

// Get student and their results by registration number
exports.getStudentByRegistrationNumber = async (req, res) => {
  const registrationNumber = req.params.registrationNumber;
  console.log("Registration Number:", registrationNumber);

  try {
    // Find the student by registration number
    const student = await Student.findOne({
      registration_number: registrationNumber,
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Find the results for the student
    const results = await Result.find({ student_id: student._id });

    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "Results not found for this student" });
    }

    res.status(200).json({
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        registrationNumber: student.registration_number,
      },
      results: results.map((result) => ({
        courseName: result.course_name,
        resultYear: result.result_year,
        marks: JSON.parse(result.result), // Assuming 'result' is stored as a JSON string
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", details: error.message });
  }
};

// Get results for the logged-in student (based on their JWT token)
exports.getResultsByStudentId = async (req, res) => {
  try {
    const student_id = req.user.id; // Extracted from JWT token (assumed available via middleware)

    // Find results for the student by their ID
    const results = await Result.find({ student_id });

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
