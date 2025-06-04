const prisma = require("../config/prisma-client");
const { queryFolderFromPath } = require("../utils/controller.util");

const fileDetailsGet = async (req, res, next) => {
  const { user } = req;
  const { folderPathParams } = req.params;
  const fileName = folderPathParams?.pop();

  // If fileName is empty, url is ending with a trailing slash meaning
  // requested resource may be a directory not a file
  if (!fileName) {
    return next();
  }

  const parentFolder = await queryFolderFromPath(user.id, folderPathParams);
  const file = await prisma.file.findFirst({
    where: {
      parent_id: parentFolder.id,
      name: fileName,
    },
  });

  // If file not found, will send request to folder get controller
  if (!file) {
    return next();
  }

  res.send(file);
};

module.exports = { fileDetailsGet };
