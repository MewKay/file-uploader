const router = require("express").Router();
const controller = require("../controllers/log-in.controller");

router.get("/", controller.logInGet);
router.post("/", controller.logInPost);

module.exports = router;
