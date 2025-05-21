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

const queryFolderFromPath = async function queryOwnersFolderFromPath(
  ownerId,
  folderPathParams,
) {
  let folderName;
  let paramsArray;

  if (!folderPathParams) {
    paramsArray = ["/"];
    folderName = "Your Files";
  } else {
    paramsArray = folderPathParams.filter((folderParam) => folderParam !== "");
    folderName = paramsArray.pop();
  }

  const idPath = await paramsArrayPathToIdPath(ownerId, paramsArray);

  const folder = await prisma.folder.findFirst({
    where: {
      path: idPath,
      name: folderName,
    },
  });

  return folder;
};

const idPathToUrl = async function translateIdPathToFolderUrl(userId, idPath) {
  const rootUrl = "/files/";
  let paramsArray = [];

  if (idPath === "/") {
    return rootUrl;
  }

  const idPathArray = idPath
    .split("/")
    .filter((id) => id !== "")
    .map((id) => parseInt(id));

  const rootFolder = await prisma.folder.findFirst({
    where: {
      id: idPathArray.shift(),
      path: "/",
      owner_id: userId,
    },
  });

  if (!rootFolder) {
    throw new Error("Invalid path");
  }

  if (idPathArray.length <= 0) {
    return rootUrl;
  }

  for (let id of idPathArray) {
    const folder = await prisma.folder.findFirst({
      where: {
        id: id,
        owner_id: userId,
      },
    });

    if (!folder) {
      throw new Error("Invalid Path");
    }

    paramsArray.push(folder.name);
  }

  const folderUrl = rootUrl + paramsArray.join("/") + "/";

  return folderUrl;
};

module.exports = { paramsArrayPathToIdPath, queryFolderFromPath, idPathToUrl };
