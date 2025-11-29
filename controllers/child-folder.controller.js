const prisma = require("../config/prisma-client");
const {
  queryFolderFromPath,
  updateAncestorsDateNow,
} = require("../utils/controller.util");
const asyncHandler = require("express-async-handler");

const folderNameValidator = require("../middlewares/validators/folder-name.validator");
const folderNameValidationHandler = require("../middlewares/validators/folder-name.handler");
const { sliceUrlEndPath } = require("../utils/file.util");
const { randomUUID } = require("node:crypto");
const { addDays } = require("date-fns");
const NotFoundError = require("../errors/not-found.error");
const addRequestContext = require("../middlewares/addRequestContext");

const createFolder = [
  addRequestContext({ operation: "create" }),
  folderNameValidator,
  folderNameValidationHandler,
  asyncHandler(async (req, res) => {
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

    const parentFolderUrl = sliceUrlEndPath(req.originalUrl);

    res.redirect(parentFolderUrl);
  }),
];

const renameFolder = [
  addRequestContext({ operation: "update" }),
  folderNameValidator,
  folderNameValidationHandler,
  asyncHandler(async (req, res) => {
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

    const parentFolderUrl = sliceUrlEndPath(req.originalUrl, 2);

    res.redirect(parentFolderUrl);
  }),
];

const deleteFolder = asyncHandler(async (req, res) => {
  const { user } = req;
  const { folderPathParams } = req.params;

  const folder = await queryFolderFromPath(user.id, folderPathParams);

  await prisma.folder.delete({
    where: {
      id: folder.id,
    },
  });

  const parentFolderUrl = sliceUrlEndPath(req.originalUrl, 2);

  res.redirect(parentFolderUrl);
});

const shareFolder = asyncHandler(async (req, res) => {
  const { user } = req;
  const { folderPathParams } = req.params;

  const folderToShare = await queryFolderFromPath(user.id, folderPathParams);
  const folderPublicId = randomUUID();
  const daysSharingAvailability = 3;

  await prisma.publicFolder.create({
    data: {
      id: folderPublicId,
      folder_id: folderToShare.id,
      owner_id: user.id,
      expires_at: addDays(new Date(), daysSharingAvailability),
    },
  });

  const sharedFolderUrl = sliceUrlEndPath(req.originalUrl);

  res.redirect(sharedFolderUrl);
});

const stopShareFolder = asyncHandler(async (req, res) => {
  const { user } = req;

  if (!user.publicFolder) {
    throw new NotFoundError("No public folder found");
  }

  await prisma.publicFolder.delete({
    where: {
      id: user.publicFolder.id,
    },
  });

  const previousFolderUrl = sliceUrlEndPath(req.originalUrl);

  res.redirect(previousFolderUrl);
});

module.exports = {
  createFolder,
  renameFolder,
  deleteFolder,
  shareFolder,
  stopShareFolder,
};
