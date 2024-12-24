const router = require("express").Router();
const {
  login,
  signUp,
  forgotPassword,
  sendConfirmationEmail,
  sendResetPasswordEmail,
  resetPassword,
  logout,
  verifyOTP,
  updatePassword,

} = require("../controllers/partners.controller");



router.post("/signup", signUp);
router.get("/logout", logout);
router.post("/verifyotp", verifyOTP);
router.post("/forgotPassword", forgotPassword);
router.post("/updatepassword", updatePassword);
router.post("/resetPassword/:token", resetPassword);
router.post("/confirmation", sendConfirmationEmail);
router.post("/login", login);
module.exports = router;
