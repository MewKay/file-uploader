const prisma = require("../config/prisma-client");
const { queryFolderFromPath } = require("../utils/controller.util");

const filesGet = async (req, res) => {
  const { user } = req;
  const { folderPathParams } = req.params;

  const currentFolder = await queryFolderFromPath(user.id, folderPathParams);
  console.log(currentFolder);

  const currentFolderList = await prisma.folder.findMany({
    where: {
      parent_id: currentFolder.id,
    },
  });

  const currentFolderParamStringLength = (encodeURI(currentFolder.name) + "/")
    .length;
  const parentDirectoryUrl = currentFolder.is_root
    ? null
    : req.originalUrl.slice(0, -currentFolderParamStringLength);

  res.render("files", {
    currentFolder,
    currentFolderList,
    parentDirectoryUrl,
  });
};

const createRootChildrenFolder = async (req, res) => {
  const { user } = req;
  const { newFolderName } = req.body;

  const rootFolder = await prisma.folder.findFirst({
    where: {
      owner_id: user.id,
      is_root: true,
    },
  });

  await prisma.folder.create({
    data: {
      name: newFolderName,
      path: rootFolder.id + "/",
      owner_id: user.id,
      parent_id: rootFolder.id,
    },
  });

  res.redirect("/files/");
};

const createFolder = async (req, res) => {
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

const renameFolder = async (req, res) => {
  const { user } = req;
  const { folderPathParams } = req.params;
  const { folderNewName } = req.body;

  const folder = await queryFolderFromPath(user.id, folderPathParams);

  await prisma.folder.update({
    where: {
      id: folder.id,
    },
    data: {
      name: folderNewName,
    },
  });

  const folderParamLength = (encodeURI(folder.name) + "/rename-folder/").length;
  const folderUrl = req.originalUrl.slice(0, -folderParamLength);

  res.redirect(folderUrl);
};

module.exports = {
  filesGet,
  createRootChildrenFolder,
  createFolder,
  renameFolder,
};
