const prisma = require("../config/prisma-client");
const { paramsArrayPathToIdPath } = require("../utils/controller.util");

const filesGet = async (req, res) => {
  const { user } = req;
  let folderPathParams = req.params.folderPathParams;
  let currentFolderName;

  if (!folderPathParams) {
    folderPathParams = ["/"];
    currentFolderName = "Your Files";
  } else {
    currentFolderName = folderPathParams.pop();
  }

  const idPath = await paramsArrayPathToIdPath(user.id, folderPathParams);
  const currentFolder = await prisma.folder.findFirst({
    where: {
      path: idPath,
      name: currentFolderName,
    },
  });

  res.render("files", { currentFolderName: currentFolder.name });
};

module.exports = { filesGet };
