var express = require("express");
var router = express.Router();

const userPersonalityRouter = require("../controllers/userPersonality.controller");
const { verifyToken } = require("../middlewares/authJwt");

router.post("/add",[verifyToken], userPersonalityRouter.addAnswer);
router.get("/get", userPersonalityRouter.getAnswers);

module.exports = router;