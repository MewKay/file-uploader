const router = require("express").Router();
const controller = require("../controllers/root-folder.controller");

router.get("/{*folderPathParams}", controller.folderGet);
router.post("/new-folder/", controller.createFolder);
router.post("/share-folder/", controller.shareFolder);
router.post("/stop-sharing/", controller.stopShareFolder);

module.exports = router;
