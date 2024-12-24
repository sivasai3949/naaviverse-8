var express = require("express");
var router = express.Router();

const universitiesController = require("../controllers/universities.controller");
const { verifyToken } = require("../middlewares/authJwt");

router.post("/add",[verifyToken], universitiesController.addUniversities);
router.get("/get", universitiesController.fetchUniversities);

module.exports = router;