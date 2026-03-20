const express = require("express");
const router = express.Router();

const { followUser, getUserProfile, updateProfile } = require("../controllers/userController");

const upload = require("../middleware/upload");

router.put("/:id", upload.single("avatar"), updateProfile);

router.post("/:id/follow", followUser);

router.get("/:id", getUserProfile);

module.exports = router;