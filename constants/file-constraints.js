const FIVE_MB = 5 * 1024 * 1024;
const fileSizeLimit = FIVE_MB;

const validMimetypes = {
  fileTypes: ["image", "text", "audio", "video"],
  documents: [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  ],
  archives: [
    "application/zip",
    "application/gzip",
    "application/x-7z-compressed",
  ],
};

module.exports = {
  fileSizeLimit,
  validMimetypes,
};
