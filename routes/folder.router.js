const router = require("express").Router();
const controller = require("../controllers/folder.controller");
const { isAuth } = require("../middlewares/auth");
const enforceTrailingSlash = require("../middlewares/enforceTrailingSlash");

router.use(isAuth);
router.use(enforceTrailingSlash);
router.get("/{*folderPathParams}", controller.filesGet);
router.post("/new-folder/", controller.createRootChildrenFolder);
router.post("/{*folderPathParams}/new-folder/", controller.createFolder);
router.post("/{*folderPathParams}/rename-folder/", controller.renameFolder);
router.post("/{*folderPathParams}/delete-folder/", controller.deleteFolder);

module.exports = router;
