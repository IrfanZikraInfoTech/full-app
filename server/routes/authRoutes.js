const express = require("express");
const {
  signup,
  login,
  logout,
  loginForResult,
} = require("../controllers/authController");
const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/result", loginForResult);
router.post("/logout", logout);

module.exports = router;
