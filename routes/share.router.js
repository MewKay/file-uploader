const router = require("express").Router();
const controller = require("../controllers/share.controller");
const enforceTrailingSlash = require("../middlewares/enforceTrailingSlash");

router.use(enforceTrailingSlash);
router.get("/:publicFolderId/{*folderPathParams}", controller.shareGet);

module.exports = router;
