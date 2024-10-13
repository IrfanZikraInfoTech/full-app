const pool = require("../config/db");

exports.getResultsByStudentId = async (req, res) => {
  const student_id = req.params.student_id;

  try {
    const [results] = await pool.query("SELECT * FROM results WHERE student_id = ?", [student_id]);

    if (results.length === 0) {
      return res.status(404).json({ message: "No results found for this student" });
    }

    res.send(results);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch results", details: err.message });
  }
};


exports.addResult = async (req, res) => {
  const { student_id, subject, total_marks, obtained_marks } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO results (student_id, subject, total_marks, obtained_marks) VALUES (?, ?, ?, ?)",
      [student_id, subject, total_marks, obtained_marks]
    );
    res.status(201).json({ message: "Result added successfully" });
  } catch (err) {
    res.status(400).json({ error: "Failed to add result", details: err.message });
  }
};


// Controller to save student result
exports.saveResult = async (req, res) => {
  const { studentId, resultName, resultYear, rows } = req.body;

  if (!studentId || !resultName || !resultYear || !rows || rows.length === 0) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const resultData = JSON.stringify(rows); // Convert the rows to JSON string

  try {
    const result = await pool.query(
      "INSERT INTO results (student_id, course_name, result_year, result) VALUES (?, ?, ?, ?)",
      [studentId, resultName, resultYear, resultData]
    );
    res.status(201).json({ message: "Results saved successfully", result });
  } catch (err) {
    res.status(500).json({ error: "Failed to save results", details: err.message });
  }
};


// Delete result by result_id
exports.deleteResultById = async (req, res) => {
  const result_id = req.params.result_id;

  try {
    const result = await pool.query("DELETE FROM results WHERE id = ?", [result_id]);

    if (result[0].affectedRows === 0) {
      return res.status(404).json({ message: "Result not found" });
    }

    res.json({ message: "Result deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete result", details: err.message });
  }
};


// Controller to update result by result_id
exports.updateResultById = async (req, res) => {
  const result_id = req.params.result_id;
  const { result } = req.body;

  if (!result) {
    return res.status(400).json({ error: "Missing result data" });
  }

  const resultData = JSON.stringify(result); // Convert the result data to a JSON string

  try {
    const updateResult = await pool.query("UPDATE results SET result = ? WHERE id = ?", [resultData, result_id]);

    if (updateResult[0].affectedRows === 0) {
      return res.status(404).json({ message: "Result not found" });
    }

    res.json({ message: "Result updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update result", details: err.message });
  }
};

