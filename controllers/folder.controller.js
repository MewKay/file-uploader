const prisma = require("../config/prisma-client");
const path = require("node:path");
const {
  queryFolderFromPath,
  queryFileFromPath,
  updateAncestorsDateNow,
} = require("../utils/controller.util");

const folderNameValidator = require("../middlewares/validators/folder-name.validator");
const folderNameValidationHandler = require("../middlewares/validators/folder-name.handler");
const upload = require("../config/multer");
const fileConstraints = require("../constants/file-constraints");
const { formatFileSize } = require("../utils/file.util");

const filesGet = async (req, res) => {
  const { user } = req;
  const { folderPathParams } = req.params;

  const currentFolder = await queryFolderFromPath(user.id, folderPathParams);

  if (!currentFolder) {
    throw new Error("File or directory does not exist");
  }

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
    currentFolder,
    currentFolderList,
    currentFilesList,
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

const uploadFile = [
  upload.single("uploaded_file"),
  async (req, res) => {
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

    const parentFolderUrl = "../";

    res.redirect(parentFolderUrl);
  },
];

const downloadFile = async (req, res) => {
  const { user } = req;
  const { filepath } = req.query;
  const filePathParams = filepath.split("/");

  const file = await queryFileFromPath(user.id, filePathParams);
  const fileLocation = path.join(__dirname, "..", "public", file.download_link);

  res.download(fileLocation, file.name);
};

module.exports = {
  filesGet,
  createRootChildrenFolder,
  createFolder,
  renameFolder,
  deleteFolder,
  uploadFile,
  downloadFile,
};
