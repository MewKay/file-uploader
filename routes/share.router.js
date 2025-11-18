const router = require("express").Router();
const controller = require("../controllers/share.controller");
const enforceTrailingSlash = require("../middlewares/enforceTrailingSlash");
const isShareRoute = require("../middlewares/is-share-route");

router.use(isShareRoute);
router.get(
  "/:publicFolderId/{*folderPathParams}",
  controller.shareFileDetailsGet,
);

router.use(enforceTrailingSlash);
router.get("/:publicFolderId/{*folderPathParams}", controller.shareGet);

module.exports = router;
