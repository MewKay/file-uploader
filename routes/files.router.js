const router = require("express").Router();
const controller = require("../controllers/files.controller");
const { isAuth } = require("../middlewares/auth");
const enforceTrailingSlash = require("../middlewares/enforceTrailingSlash");

router.use(isAuth);
router.use(enforceTrailingSlash);
router.get("/{*folderPathParams}", controller.filesGet);
router.post("/{*folderPathParams}/new-folder/", controller.createSubFolder);

module.exports = router;
