const prisma = require("../config/prisma-client");
const { queryFolderFromPath, getFullUrl } = require("../utils/controller.util");
const asyncHandler = require("express-async-handler");

const fileConstraints = require("../constants/file-constraints");
const { formatFileSize, sliceUrlEndPath } = require("../utils/file.util");
const addRequestContext = require("../middlewares/addRequestContext");
const folderNameValidator = require("../middlewares/validators/folder-name.validator");
const folderNameValidationHandler = require("../middlewares/validators/folder-name.handler");
const { randomUUID } = require("node:crypto");
const { addDays } = require("date-fns");
const NotFoundError = require("../errors/not-found.error");

const folderGet = asyncHandler(async (req, res) => {
  const { user } = req;
  const { folderPathParams } = req.params;

  const currentFolder = await queryFolderFromPath(user.id, folderPathParams);

  if (!currentFolder) {
    return res.status(404).render("not-found-index");
  }

  const sharedFolderStatus = await prisma.publicFolder.findUnique({
    where: {
      owner_id: user.id,
    },
    include: {
      folder: true,
    },
  });

  const currentFolderList = await prisma.folder.findMany({
    where: {
      parent_id: currentFolder.id,
    },
    orderBy: {
      name: "asc",
    },
  });

  const currentFilesList = await prisma.file.findMany({
    where: {
      parent_id: currentFolder.id,
    },
    orderBy: {
      name: "asc",
    },
  });

  res.render("files-index", {
    fileUtils: {
      fileConstraints,
      formatFileSize,
    },
    folderPath: folderPathParams?.join("/"),
    sharedFolderStatus,
    sharedFolderFullUrl: getFullUrl(`/share/${sharedFolderStatus?.id}/`),
    currentFolder,
    currentFolderList,
    currentFilesList,
  });
});

const createFolder = [
  addRequestContext({ operation: "create" }),
  folderNameValidator,
  folderNameValidationHandler,
  asyncHandler(async (req, res) => {
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
  }),
];

const shareFolder = asyncHandler(async (req, res) => {
  const { user } = req;

  const folderToShare = await prisma.folder.findFirst({
    where: {
      owner_id: user.id,
      is_root: true,
    },
  });
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

  res.redirect("/files/");
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
  folderGet,
  createFolder,
  shareFolder,
  stopShareFolder,
};
