const router = require("express").Router({ mergeParams: true });
const controller = require("../controllers/folder.controller");

router.post("/{*folderPathParams}/new-folder/", controller.createFolder);
router.post("/{*folderPathParams}/rename-folder/", controller.renameFolder);
router.post("/{*folderPathParams}/delete-folder/", controller.deleteFolder);
router.post("/{*folderPathParams}/share-folder/", controller.shareFolder);
router.post("/{*folderPathParams}/stop-sharing/", controller.stopShareFolder);

module.exports = router;
