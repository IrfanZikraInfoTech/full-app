const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  registration_number: { type: String, required: true, unique: true },
  aadhar_number: { type: String, required: true },
  fathername: { type: String, required: true }, // Added fathername
});

const Student = mongoose.model("Student", studentSchema);
module.exports = Student;
