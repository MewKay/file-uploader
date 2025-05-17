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
    folderPathParams = folderPathParams.filter(
      (folderParam) => folderParam !== "",
    );
    currentFolderName = folderPathParams.pop();
  }

  const idPath = await paramsArrayPathToIdPath(user.id, folderPathParams);
  const currentFolder = await prisma.folder.findFirst({
    where: {
      path: idPath,
      name: currentFolderName,
    },
  });

  const currentFolderList = await prisma.folder.findMany({
    where: {
      parent_id: currentFolder.id,
    },
  });

  res.render("files", {
    currentFolder,
    currentFolderList,
  });
};

module.exports = { filesGet };
