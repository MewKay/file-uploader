const prisma = require("../config/prisma-client");

const queryFolderFromPath = async function queryOwnersFolderFromPath(
  ownerId,
  folderPathParams,
) {
  const folderRoot = await prisma.folder.findFirst({
    where: {
      owner_id: ownerId,
      is_root: true,
    },
  });

  if (!folderPathParams || folderPathParams.length <= 0) {
    return folderRoot;
  }

  const idPathArray = [];
  idPathArray.push(folderRoot.id);

  let folder;
  const paramsArray = folderPathParams.filter(
    (folderParam) => folderParam !== "",
  );
  for (let folderName of paramsArray) {
    const folderParentId = idPathArray.at(-1);

    folder = await prisma.folder.findFirst({
      where: {
        owner_id: ownerId,
        parent_id: folderParentId,
        name: folderName,
      },
    });

    if (!folder) {
      return null;
    }

    idPathArray.push(folder.id);
  }

  return folder;
};

const queryFileFromPath = async function queryOwnersFileFromPath(
  userId,
  filePathParams,
) {
  const fileName = filePathParams?.pop();
  const isPathForFiles = !fileName ? false : true;

  if (!isPathForFiles) {
    return null;
  }

  const parentFolder = await queryFolderFromPath(userId, filePathParams);

  if (!parentFolder) {
    return null;
  }

  const file = await prisma.file.findFirst({
    where: {
      owner_id: userId,
      parent_id: parentFolder.id,
      name: fileName,
    },
  });

  return file;
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
    return null;
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
      return null;
    }

    paramsArray.push(folder.name);
  }

  const folderUrl = rootUrl + paramsArray.join("/") + "/";

  return folderUrl;
};

const updateAncestorsDateNow =
  async function updateFoldersDateAndItsAncestorsToNow(folderId) {
    if (!folderId) {
      return;
    }

    const folder = await prisma.folder.update({
      where: {
        id: folderId,
      },
      data: {
        updated_at: new Date(),
      },
    });

    await updateFoldersDateAndItsAncestorsToNow(folder.parent_id);
  };

const getFullUrl = (originalUrl) => {
  const baseUrl = process.env.BASE_URL || "http://localhost:3000";
  return `${baseUrl}${originalUrl}`;
};

module.exports = {
  queryFolderFromPath,
  queryFileFromPath,
  idPathToUrl,
  updateAncestorsDateNow,
  getFullUrl,
};
