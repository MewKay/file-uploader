const asyncHandler = require("express-async-handler");
const { queryFileFromPath, querySharedFolder } = require("../utils/share.util");
const NotFoundError = require("../errors/not-found.error");
const prisma = require("../config/prisma-client");
const { downloadUserFileFromStorage } = require("../utils/file.util");

const shareGet = asyncHandler(async (req, res) => {
  const { publicFolderId, folderPathParams } = req.params;

  const folder = await querySharedFolder(publicFolderId, folderPathParams);

  if (!folder) {
    throw new NotFoundError("No such shared folder");
  }

  const currentFolderList = await prisma.folder.findMany({
    where: {
      parent_id: folder.id,
    },
    orderBy: {
      name: "asc",
    },
  });

  const currentFilesList = await prisma.file.findMany({
    where: {
      parent_id: folder.id,
    },
    orderBy: {
      name: "asc",
    },
  });

  res.render("share-index", {
    folderPath: folderPathParams?.join("/"),
    publicFolderId,
    currentFolder: {
      ...folder,
      is_public_root: folder.public && folder.public.id === publicFolderId,
    },
    currentFolderList,
    currentFilesList,
  });
});

const shareFileDetailsGet = asyncHandler(async (req, res, next) => {
  const { publicFolderId, folderPathParams } = req.params;
  const filePathParams = structuredClone(folderPathParams);

  const file = await queryFileFromPath(publicFolderId, filePathParams);

  if (!file) {
    return next();
  }

  res.render("file-details", {
    publicFolderId,
    fileDetails: file,
    filepath: folderPathParams.join("/"),
  });
});

const downloadSharedFile = asyncHandler(async (req, res) => {
  const { publicFolderId } = req.params;
  const { filepath } = req.query;
  const filePathParams = filepath.split("/");

  const file = await queryFileFromPath(publicFolderId, filePathParams);

  if (!file) {
    throw new NotFoundError("No such file found");
  }

  const fileBuffer = await downloadUserFileFromStorage(file);

  res.setHeader("Content-Disposition", `attachement; filename="${file.name}"`);
  res.setHeader("Content-Type", file.mime_type);
  res.setHeader("Content-Length", fileBuffer.length);

  res.send(fileBuffer);
});

module.exports = { shareGet, shareFileDetailsGet, downloadSharedFile };
