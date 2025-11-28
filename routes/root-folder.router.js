const router = require("express").Router();
const controller = require("../controllers/folder.controller");

router.get("/{*folderPathParams}", controller.folderGet);
router.post("/new-folder/", controller.createRootChildrenFolder);
router.post("/share-folder/", controller.shareRootFolder);
router.post("/stop-sharing/", controller.stopShareFolder);

module.exports = router;
