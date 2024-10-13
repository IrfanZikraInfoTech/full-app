const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  course_name: { type: String, required: true },
  result_year: { type: Number, required: true },
  result: { type: String, required: true }, // JSON string for results
  subject: { type: String }, // Optional for subject-specific results
  total_marks: { type: Number }, // Optional fields for individual results
  obtained_marks: { type: Number }, // Optional fields for individual results
});

const Result = mongoose.model("Result", resultSchema);
module.exports = Result;
