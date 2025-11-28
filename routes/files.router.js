const router = require("express").Router();

const rootFolderRouter = require("./root-folder.router");
const childFolderRouter = require("./child-folder.router");
const fileRouter = require("./file.router");
const { isAuth } = require("../middlewares/auth");
const enforceTrailingSlash = require("../middlewares/enforceTrailingSlash");
const controller = require("../controllers/folder.controller");

router.use(isAuth);
router.use("/{*folderPathParams}", fileRouter);
router.get("/download", controller.downloadFile);

router.use(enforceTrailingSlash);
router.get("/{*folderPathParams}", controller.filesGet);

router.use(rootFolderRouter);
router.use(childFolderRouter);

module.exports = router;
