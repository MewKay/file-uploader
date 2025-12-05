const path = require("node:path");
const prisma = require("../config/prisma-client");
const upload = require("../config/multer");
const asyncHandler = require("express-async-handler");
const {
  queryFileFromPath,
  queryFolderFromPath,
} = require("../utils/controller.util");
const { sliceUrlEndPath } = require("../utils/file.util");

const fileDetailsGet = asyncHandler(async (req, res, next) => {
  const { user } = req;
  const { folderPathParams } = req.params;
  const filePathParams = structuredClone(folderPathParams);

  const file = await queryFileFromPath(user.id, filePathParams);

  // If file not found, will send request to folder get controller
  if (!file) {
    return next();
  }

  res.render("file-details", {
    fileDetails: file,
    filepath: folderPathParams.join("/"),
  });
});

const downloadFile = asyncHandler(async (req, res) => {
  const { user } = req;
  const { filepath } = req.query;
  const filePathParams = filepath.split("/");

  const file = await queryFileFromPath(user.id, filePathParams);

  if (!file) {
    return res.status(404).render("not-found-index");
  }

  const fileLocation = path.join(__dirname, "..", "public", file.download_link);

  res.download(fileLocation, file.name);
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
        storage_file_path: `${user.storage_folder_id}/${file.originalname}`,
        owner_id: user.id,
        parent_id: parentFolder.id,
      },
    });

    const parentFolderUrl = sliceUrlEndPath(req.originalUrl);

    res.redirect(parentFolderUrl);
  }),
];

module.exports = {
  fileDetailsGet,
  downloadFile,
  uploadFileToRootFolder,
  uploadFile,
};
