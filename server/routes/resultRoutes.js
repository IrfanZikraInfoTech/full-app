const express = require("express");
const {
  saveResult,
  getResultsByStudentId,
  deleteResultById,
  updateResultById
} = require("../controllers/resultController");
const auth = require("../middleware/auth"); // Assuming you have auth middleware
const router = express.Router();

// POST route to save the result
router.post("/save-result", auth, saveResult);
router.get("/results/:student_id", auth, getResultsByStudentId);
router.delete("/results/:result_id", auth, deleteResultById);
router.put("/results/:result_id", auth, updateResultById); 

module.exports = router;
