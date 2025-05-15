const router = require("express").Router();
const controller = require("../controllers/sign-up.controller");

router.get("/", controller.signUpGet);
router.post("/", controller.signUpPost);

module.exports = router;
