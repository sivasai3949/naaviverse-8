var express = require("express");
var router = express.Router();

const usersDataController = require("../controllers/users.controller");
const usersController = require("../controllers/user_controller");

router.post("/add", usersController.addUserData);
router.get("/get", usersController.getAllUserProfiles);
router.put("/update/:id", usersController.updateUserProfile);
router.put("/addMentor/:id", usersController.changeUserType);
router.put("/addPersonality", usersDataController.updateUser)


module.exports = router;