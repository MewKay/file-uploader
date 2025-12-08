const { isPast } = require("date-fns");
const prisma = require("../config/prisma-client");

const querySharedFolder = async (
  publicFolderId,
  folderPathParams,
  queriedRootFolder = null,
) => {
  const rootSharedFolder = queriedRootFolder
    ? queriedRootFolder
    : await prisma.folder.findFirst({
        where: {
          public: {
            id: publicFolderId,
          },
        },
        include: {
          public: {
            select: {
              id: true,
            },
          },
          owner: {
            select: {
              username: true,
            },
          },
        },
      });

  if (!rootSharedFolder) {
    return null;
  }

  const isCurrentFolderRoot = !folderPathParams || folderPathParams.length <= 0;
  if (isCurrentFolderRoot) {
    return rootSharedFolder;
  }

  const idPaths = rootSharedFolder.path.split("/").filter((id) => id !== "");
  idPaths.push(rootSharedFolder.id);
  const paramsArray = folderPathParams.filter(
    (folderParam) => folderParam !== "",
  );

  let lastPathFolder;
  for (let folderName of paramsArray) {
    lastPathFolder = await prisma.folder.findFirst({
      where: {
        parent_id: idPaths.at(-1),
        name: folderName,
      },
      include: {
        public: {
          select: {
            id: true,
          },
        },
        owner: {
          select: {
            username: true,
          },
        },
      },
    });

    if (!lastPathFolder) {
      return null;
    }

    idPaths.push(lastPathFolder.id);
  }

  return lastPathFolder;
};

const queryFileFromPath = async (
  publicFolderId,
  filePathParams,
  queriedRootFolder = null,
) => {
  const fileName = filePathParams?.pop();
  const isPathForFiles = !fileName ? false : true;

  if (!isPathForFiles) {
    return null;
  }

  const parentFolder = await querySharedFolder(
    publicFolderId,
    filePathParams,
    queriedRootFolder,
  );

  if (!parentFolder) {
    return null;
  }

  const file = await prisma.file.findFirst({
    where: {
      parent_id: parentFolder.id,
      name: fileName,
    },
  });

  return file;
};

const getSharedFolderModel = (sharedFolder) => {
  if (sharedFolder.public) {
    return "folder";
  }

  if (sharedFolder.expires_at) {
    return "public_folder";
  }

  return false;
};

const checkSharedFolderExpiry = async (sharedFolder) => {
  const sharedFolderModel = getSharedFolderModel(sharedFolder);

  if (!sharedFolderModel) {
    throw new Error("Invalid folder model");
  }

  const expirationDate =
    sharedFolderModel === "folder"
      ? sharedFolder.public.expires_at
      : sharedFolder.expires_at;

  if (!isPast(expirationDate)) {
    return false;
  }

  const sharedFolderPublicId =
    sharedFolderModel === "folder" ? sharedFolder.public.id : sharedFolder.id;

  await prisma.publicFolder.delete({
    where: {
      id: sharedFolderPublicId,
    },
  });

  return true;
};

module.exports = {
  querySharedFolder,
  queryFileFromPath,
  checkSharedFolderExpiry,
};
