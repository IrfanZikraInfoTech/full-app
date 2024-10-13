const Result = require("../models/Result"); // Import the Result model

exports.getResultsByStudentId = async (req, res) => {
  const student_id = req.params.student_id;

  try {
    const results = await Result.find({ student_id });

    if (results.length === 0) {
      return res
        .status(404)
        .json({ message: "No results found for this student" });
    }

    res.status(200).json(results);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch results", details: err.message });
  }
};

exports.addResult = async (req, res) => {
  const { student_id, subject, total_marks, obtained_marks } = req.body;

  try {
    const newResult = new Result({
      student_id,
      subject,
      total_marks,
      obtained_marks,
    });

    await newResult.save();
    res.status(201).json({ message: "Result added successfully" });
  } catch (err) {
    res
      .status(400)
      .json({ error: "Failed to add result", details: err.message });
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
    const newResult = new Result({
      student_id: studentId,
      course_name: resultName,
      result_year: resultYear,
      result: resultData,
    });

    await newResult.save();
    res.status(201).json({ message: "Results saved successfully", newResult });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to save results", details: err.message });
  }
};

// Delete result by result_id
exports.deleteResultById = async (req, res) => {
  const result_id = req.params.result_id;

  try {
    const result = await Result.findByIdAndDelete(result_id);

    if (!result) {
      return res.status(404).json({ message: "Result not found" });
    }

    res.status(200).json({ message: "Result deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to delete result", details: err.message });
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
    const updateResult = await Result.findByIdAndUpdate(
      result_id,
      { result: resultData },
      { new: true } // Return the updated document
    );

    if (!updateResult) {
      return res.status(404).json({ message: "Result not found" });
    }

    res
      .status(200)
      .json({ message: "Result updated successfully", updateResult });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to update result", details: err.message });
  }
};
