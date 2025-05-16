const router = require("express").Router();
const controller = require("../controllers/files.controller");
const { isAuth } = require("../middlewares/auth");

router.use(isAuth);
router.get("/{*folderPathParams}", controller.filesGet);

module.exports = router;
