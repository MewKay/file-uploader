const multer = require("multer");

const FIVE_MB = 5 * 1024 * 1024;
const ACCEPTED_FILE_TYPES = ["image", "text", "audio", "video"];
const ACCEPTED_DOCUMENTS = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
];
const ACCEPTED_ARCHIVES = [
  "application/zip",
  "application/gzip",
  "application/x-7z-compressed",
];

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
  fileSize: FIVE_MB,
  files: 1,
};

const fileFilter = (req, file, callback) => {
  const fileType = file.mimetype.split("/")[0];
  const isFileAcceptedMimeType =
    ACCEPTED_FILE_TYPES.includes(fileType) ||
    ACCEPTED_ARCHIVES.includes(file.mimetype) ||
    ACCEPTED_DOCUMENTS.includes(file.mimetype);

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
