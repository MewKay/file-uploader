const asyncHandler = require("express-async-handler");
const { querySharedFolder } = require("../utils/share.util");
const NotFoundError = require("../errors/not-found.error");

const shareGet = asyncHandler(async (req, res) => {
  const { publicFolderId, folderPathParams } = req.params;

  const folder = await querySharedFolder(publicFolderId, folderPathParams);

  if (!folder) {
    throw new NotFoundError("No such shared folder");
  }

  res.send(folder);
});

module.exports = { shareGet };
