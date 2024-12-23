var express = require("express");
var router = express.Router();

const servicesController = require("../controllers/services.controller");
const { verifyToken } = require("../middlewares/authJwt");

router.post("/add", [verifyToken], servicesController.addService);
router.get("/get", servicesController.getServices);
router.put("/update/:id",[verifyToken], servicesController.updateService);
// router.put("/complete/:id", stepsController.updateCompletedStep);
router.delete("/delete/:id", [verifyToken], servicesController.deleteService);
router.put("/restore/:id",[verifyToken], servicesController.restoreService);

module.exports = router;