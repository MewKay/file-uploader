const prisma = require("../config/prisma-client");

const paramsArrayPathToIdPath =
  async function queryCurrentFolderIdPathFromFolderParamsArray(
    userId,
    paramsArray,
  ) {
    let idPath;
    const rootPath = "/";
    const isCurrentFolderRoot = paramsArray[0] === rootPath;

    if (isCurrentFolderRoot) {
      idPath = rootPath;
      return idPath;
    }

    const idPathArray = [];
    const folderRoot = await prisma.folder.findFirst({
      where: {
        owner_id: userId,
        is_root: true,
      },
    });
    idPathArray.push(folderRoot.id);

    for (let folderName of paramsArray) {
      const folderParentId = idPathArray.at(-1);

      const folder = await prisma.folder.findFirst({
        where: {
          owner_id: userId,
          parent_id: folderParentId,
          name: folderName,
        },
      });

      if (!folder) {
        throw new Error("Invalid path");
      }

      idPathArray.push(folder.id);
    }

    idPath = idPathArray.join("/").concat("/");

    return idPath;
  };

module.exports = { paramsArrayPathToIdPath };
