const { Router } = require("express");
const router = Router({ mergeParams: true });
const controller = require("../controllers/file.controller");

router.get("/", controller.fileDetailsGet);

module.exports = router;
