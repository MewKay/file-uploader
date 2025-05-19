const prisma = require("../config/prisma-client");
const { queryFolderFromPath } = require("../utils/controller.util");

const filesGet = async (req, res) => {
  const { user } = req;
  const { folderPathParams } = req.params;

  const currentFolder = await queryFolderFromPath(user.id, folderPathParams);
  const currentFolderList = await prisma.folder.findMany({
    where: {
      parent_id: currentFolder.id,
    },
  });

  res.render("files", {
    currentFolder,
    currentFolderList,
  });
};

const createSubFolder = async (req, res) => {
  const { user } = req;
  const { folderPathParams } = req.params;
  const { newFolderName } = req.body;

  const parentFolder = await queryFolderFromPath(user.id, folderPathParams);

  await prisma.folder.create({
    data: {
      name: newFolderName,
      path: parentFolder.path + parentFolder.id + "/",
      owner_id: user.id,
      parent_id: parentFolder.id,
    },
  });

  const newFolderStringLength = "new-folder/".length;
  const parentFolderUrl = req.originalUrl.slice(0, -newFolderStringLength);

  res.redirect(parentFolderUrl);
};

module.exports = { filesGet, createSubFolder };
