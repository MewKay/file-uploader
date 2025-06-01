const prisma = require("../config/prisma-client");
const {
  queryFolderFromPath,
  updateAncestorsDateNow,
} = require("../utils/controller.util");

const folderNameValidator = require("../middlewares/validators/folder-name.validator");
const folderNameValidationHandler = require("../middlewares/validators/folder-name.handler");

const filesGet = async (req, res) => {
  const { user } = req;
  const { folderPathParams } = req.params;

  const currentFolder = await queryFolderFromPath(user.id, folderPathParams);

  const currentFolderList = await prisma.folder.findMany({
    where: {
      parent_id: currentFolder.id,
    },
    orderBy: {
      name: "asc",
    },
  });

  res.render("files-index", {
    currentFolder,
    currentFolderList,
  });
};

const createRootChildrenFolder = [
  folderNameValidator,
  folderNameValidationHandler,
  async (req, res) => {
    const { user } = req;
    const { folderName } = req.body;

    const rootFolder = await prisma.folder.findFirst({
      where: {
        owner_id: user.id,
        is_root: true,
      },
    });

    await prisma.folder.create({
      data: {
        name: folderName,
        path: rootFolder.id + "/",
        owner_id: user.id,
        parent_id: rootFolder.id,
      },
    });

    res.redirect("/files/");
  },
];

const createFolder = [
  folderNameValidator,
  folderNameValidationHandler,
  async (req, res) => {
    const { user } = req;
    const { folderPathParams } = req.params;
    const { folderName } = req.body;

    const parentFolder = await queryFolderFromPath(user.id, folderPathParams);

    await prisma.folder.create({
      data: {
        name: folderName,
        path: parentFolder.path + parentFolder.id + "/",
        owner_id: user.id,
        parent_id: parentFolder.id,
      },
    });

    const parentFolderUrl = "../";

    res.redirect(parentFolderUrl);
  },
];

const renameFolder = [
  folderNameValidator,
  folderNameValidationHandler,
  async (req, res) => {
    const { user } = req;
    const { folderPathParams } = req.params;
    const { folderName } = req.body;

    const folder = await queryFolderFromPath(user.id, folderPathParams);

    await prisma.folder.update({
      where: {
        id: folder.id,
      },
      data: {
        name: folderName,
      },
    });

    await updateAncestorsDateNow(folder.id);

    // To remove /rename-folder and /folder name from url
    const parentFolderUrl = "../../";

    res.redirect(parentFolderUrl);
  },
];

const deleteFolder = async (req, res) => {
  const { user } = req;
  const { folderPathParams } = req.params;

  const folder = await queryFolderFromPath(user.id, folderPathParams);

  await prisma.folder.delete({
    where: {
      id: folder.id,
    },
  });

  // To remove /delete-folder/ and /folder name from url
  const parentFolderUrl = "../../";

  res.redirect(parentFolderUrl);
};

module.exports = {
  filesGet,
  createRootChildrenFolder,
  createFolder,
  renameFolder,
  deleteFolder,
};
