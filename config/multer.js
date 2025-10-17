const multer = require("multer");
const {
  fileSizeLimit,
  validMimetypes,
} = require("../constants/file-constraints");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./public/data/uploads/");
  },
  filename: (req, file, callback) => {
    const newFilename = file.originalname + "-" + Date.now();

    callback(null, newFilename);
  },
});

const limits = {
  fileSize: fileSizeLimit,
  files: 1,
};

const fileFilter = (req, file, callback) => {
  const { fileTypes, archives, documents } = validMimetypes;

  const fileType = file.mimetype.split("/")[0];
  const isFileAcceptedMimeType =
    fileTypes.includes(fileType) ||
    archives.includes(file.mimetype) ||
    documents.includes(file.mimetype);

  if (!isFileAcceptedMimeType) {
    return callback(new Error(`Mimetype ${file.mimetype} is invalid`));
  }

  callback(null, true);
};

const upload = multer({
  storage,
  limits,
  fileFilter,
});

module.exports = upload;
