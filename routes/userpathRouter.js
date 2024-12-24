var express = require("express");
var router = express.Router();

const userpathController = require("../controllers/userPaths.controller");
const { verifyToken } = require("../middlewares/authJwt");

router.post("/add",[verifyToken], userpathController.addUserPath);
router.get("/get", userpathController.getUserPath);
router.get("/getCurrentStep", userpathController.getCurrentUserPath);
router.put("/completeStep",[verifyToken], userpathController.completeStep)
router.put("/failedStep" ,[verifyToken], userpathController.failedStep)
router.post("/getcmrusers", userpathController.getUserPathbyPartner);

module.exports = router;