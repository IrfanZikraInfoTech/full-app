const express = require("express");
const { getStudents, addStudent, deleteStudent, getStudentByRegistrationNumber,getResultsByStudentId } = require("../controllers/studentController");
const {
  
  addResult,
} = require("../controllers/resultController");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/students", auth, getStudents);
router.post("/students", auth, addStudent);
router.get("/students/:student_id/results", auth, getResultsByStudentId);
router.post("/results", auth, addResult);
router.delete("/students/:id", auth, deleteStudent);
router.get('/student/:registrationNumber', auth, getStudentByRegistrationNumber);
router.get('/student/result', auth, getResultsByStudentId);
router.get("/result", auth, getResultsByStudentId);

module.exports = router;
