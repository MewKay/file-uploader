const router = require("express").Router();

const rootFolderRouter = require("./root-folder.router");
const childFolderRouter = require("./child-folder.router");
const { isAuth } = require("../middlewares/auth");
const enforceTrailingSlash = require("../middlewares/enforceTrailingSlash");
const controller = require("../controllers/files.controller");

router.use(isAuth);
router.use("/{*folderPathParams}", controller.fileDetailsGet);
router.get("/download", controller.downloadFile);

router.use(enforceTrailingSlash);

router.post("/upload-file/", controller.uploadFileToRootFolder);
router.post("/{*folderPathParams}/upload-file/", controller.uploadFile);

router.use(rootFolderRouter);
router.use(childFolderRouter);

module.exports = router;
