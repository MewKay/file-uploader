const router = require("express").Router();
const controller = require("../controllers/share.controller");
const enforceTrailingSlash = require("../middlewares/enforceTrailingSlash");
const isShareFolderValid = require("../middlewares/is-share-folder-valid");
const isShareRoute = require("../middlewares/is-share-route");

router.use(isShareRoute);
router.use("/:publicFolderId", isShareFolderValid);
router.get(
  "/:publicFolderId/{*folderPathParams}",
  controller.shareFileDetailsGet,
);
router.get("/:publicFolderId/download", controller.downloadSharedFile);

router.use(enforceTrailingSlash);
router.get("/:publicFolderId/{*folderPathParams}", controller.shareGet);

module.exports = router;
