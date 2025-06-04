const router = require("express").Router();
const fileRouter = require("./file.router");
const controller = require("../controllers/files.controller");

const { isAuth } = require("../middlewares/auth");
const enforceTrailingSlash = require("../middlewares/enforceTrailingSlash");

router.use(isAuth);

router.use("/{*folderPathParams}", fileRouter);

router.use(enforceTrailingSlash);
router.get("/{*folderPathParams}", controller.filesGet);

router.post("/new-folder/", controller.createRootChildrenFolder);
router.post("/{*folderPathParams}/new-folder/", controller.createFolder);
router.post("/{*folderPathParams}/rename-folder/", controller.renameFolder);
router.post("/{*folderPathParams}/delete-folder/", controller.deleteFolder);

router.post("/{*folderPathParams}/upload-file/", controller.uploadFile);

module.exports = router;
