const router = require("express").Router();
const controller = require("../controllers/folder.controller");

router.post("/new-folder/", controller.createRootChildrenFolder);
router.post("/share-folder/", controller.shareRootFolder);
router.post("/stop-sharing/", controller.stopShareFolder);
router.post("/upload-file/", controller.uploadFileToRootFolder);

module.exports = router;
