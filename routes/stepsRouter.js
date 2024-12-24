var express = require("express");
var router = express.Router();

const stepsController = require("../controllers/steps.controller");
const { verifyToken } = require("../middlewares/authJwt");

router.post("/add", stepsController.addStep);
router.get("/get", stepsController.getSteps);
router.put("/update/:id",[verifyToken], stepsController.updateStep);
// router.put("/complete/:id", stepsController.updateCompletedStep);
router.delete("/delete/:id", stepsController.deleteStep);
router.put("/restore/:id",[verifyToken], stepsController.restoreStep);

module.exports = router;