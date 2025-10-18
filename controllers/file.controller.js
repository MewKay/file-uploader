const { queryFileFromPath } = require("../utils/controller.util");
const asyncHandler = require("express-async-handler");

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

module.exports = { fileDetailsGet };
