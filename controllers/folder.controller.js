const prisma = require("../config/prisma-client");
const path = require("node:path");
const {
  queryFolderFromPath,
  queryFileFromPath,
  updateAncestorsDateNow,
  getFullUrl,
} = require("../utils/controller.util");
const asyncHandler = require("express-async-handler");

const folderNameValidator = require("../middlewares/validators/folder-name.validator");
const folderNameValidationHandler = require("../middlewares/validators/folder-name.handler");
const upload = require("../config/multer");
const fileConstraints = require("../constants/file-constraints");
const { formatFileSize, sliceUrlEndPath } = require("../utils/file.util");
const { randomUUID } = require("node:crypto");
const { addDays } = require("date-fns");
const NotFoundError = require("../errors/not-found.error");

const filesGet = asyncHandler(async (req, res) => {
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
    sharedFolderFullUrl: getFullUrl(`/share/${sharedFolderStatus?.id}`),
    currentFolder,
    currentFolderList,
    currentFilesList,
  });
});

const createRootChildrenFolder = [
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

const createFolder = [
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

const shareRootFolder = asyncHandler(async (req, res) => {
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

const uploadFileToRootFolder = [
  upload.single("uploaded_file"),
  asyncHandler(async (req, res) => {
    const { user, file } = req;

    const rootFolder = await prisma.folder.findFirst({
      where: {
        owner_id: user.id,
        is_root: true,
      },
    });

    await prisma.file.create({
      data: {
        name: file.originalname,
        size: file.size,
        mime_type: file.mimetype,
        download_link: "/data/uploads/" + file.filename,
        owner_id: user.id,
        parent_id: rootFolder.id,
      },
    });

    res.redirect("/files/");
  }),
];

const uploadFile = [
  upload.single("uploaded_file"),
  asyncHandler(async (req, res) => {
    const { user, file } = req;
    const { folderPathParams } = req.params;

    const parentFolder = await queryFolderFromPath(user.id, folderPathParams);

    await prisma.file.create({
      data: {
        name: file.originalname,
        size: file.size,
        mime_type: file.mimetype,
        download_link: "/data/uploads/" + file.filename,
        owner_id: user.id,
        parent_id: parentFolder.id,
      },
    });

    const parentFolderUrl = sliceUrlEndPath(req.originalUrl);

    res.redirect(parentFolderUrl);
  }),
];

const downloadFile = asyncHandler(async (req, res) => {
  const { user } = req;
  const { filepath } = req.query;
  const filePathParams = filepath.split("/");

  const file = await queryFileFromPath(user.id, filePathParams);
  const fileLocation = path.join(__dirname, "..", "public", file.download_link);

  res.download(fileLocation, file.name);
});

module.exports = {
  filesGet,
  createRootChildrenFolder,
  createFolder,
  renameFolder,
  deleteFolder,
  uploadFileToRootFolder,
  uploadFile,
  downloadFile,
  shareRootFolder,
  shareFolder,
  stopShareFolder,
};
